<?php
require_once './src/Database.php';
require_once './src/TMDBMovie.php';
require_once './src/SSettings.php';

/**
 * Class VideoParser
 * handling the parsing of all videos of a folder and adding
 * all videos with tags and thumbnails to the database
 */
class VideoParser {
    /// ffmpeg installation binary
    private string $ffmpeg = 'ffmpeg';
    private TMDBMovie $tmdb;
    /// initial load of all available movie genres
    private $tmdbgenres;
    private string $videopath;

    /// db connection instance
    private $conn;

    /// settings object instance
    private $settings;

    private $TMDBenabled;
    private $added;
    private $all;
    private $failed;
    private $deleted;

    /**
     * VideoParser constructor.
     */
    public function __construct() {
        $this->tmdb = new TMDBMovie();
        $this->tmdbgenres = $this->tmdb->getAllGenres();
        $this->conn = Database::getInstance()->getConnection();

        $this->settings = new SSettings();
        $this->TMDBenabled = $this->settings->isTMDBGrabbingEnabled();
        $this->videopath = $this->settings->getVideoPath();
    }

    /**
     * searches a folder for mp4 videos and adds them to video gravity
     * @param $foldername the folder where to search (relative to the webserver root)
     */
    public function extractVideos($foldername) {
        echo("TMDB grabbing is " . ($this->TMDBenabled ? "" : "not") . " enabled \n");
        $arr = scandir($foldername);

        foreach ($arr as $elem) {
            $ext = pathinfo($elem, PATHINFO_EXTENSION);
            if ($ext == "mp4") {
                $this->processVideo($elem);
            } else {
                echo($elem . " does not contain a .mp4 extension! - skipping \n");
                $this->writeLog($elem . " does not contain a .mp4 extension! - skipping \n");
            }
        }

        // cleanup gravity
        $this->cleanUpGravity();

        // calculate size of databse here
        $size = -1;
        $query = "SELECT table_schema AS \"Database\", 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 3) AS \"Size\" 
                        FROM information_schema.TABLES 
                        WHERE TABLE_SCHEMA='" . Database::getInstance()->getDatabaseName() . "'
                        GROUP BY table_schema;";
        $result = $this->conn->query($query);
        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $size = $row["Size"];
        }

        echo "Total gravity: " . $this->all . "\n";
        $this->writeLog("Total gravity: " . $this->all . "\n");
        echo "Size of Databse is: " . $size . "MB\n";
        $this->writeLog("Size of Databse is: " . $size . "MB\n");
        echo "added in this run: " . $this->added . "\n";
        $this->writeLog("added in this run: " . $this->added . "\n");
        echo "deleted in this run: " . $this->deleted . "\n";
        $this->writeLog("deleted in this run: " . $this->deleted . "\n");
        echo "errored in this run: " . $this->failed . "\n";
        $this->writeLog("errored in this run: " . $this->failed . "\n");

        $this->writeLog("-42"); // terminating characters to stop webui requesting infos
    }

    /**
     * processes one mp4 video, extracts tags and adds it to the database
     */
    private function processVideo($filename) {
        $moviename = substr($filename, 0, -4);

        $query = "SELECT * FROM videos WHERE movie_name = '" . mysqli_real_escape_string($this->conn, $moviename) . "'";
        $result = $this->conn->query($query);

        // insert if not available in db
        if (!mysqli_fetch_assoc($result)) {
            $genres = -1;
            $insert_query = "";

            // extract other video attributes
            $video_attributes = $this->_get_video_attributes($filename);
            $duration = 0;
            $size = 0;
            $width = 0;

            if ($video_attributes) {
                $duration = $video_attributes->media->track[0]->Duration; // in seconds
                $size = $video_attributes->media->track[0]->FileSize; // in Bytes
                $width = $video_attributes->media->track[1]->Width; // width
            }

            // extract poster from video
            $backpic = shell_exec("$this->ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../$this->videopath$filename\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");
            // convert video to base64
            $backpic64 = 'data:image/jpeg;base64,' . base64_encode($backpic);

            // check if tmdb grabbing is enabled
            if ($this->TMDBenabled) {
                // search in tmdb api
                try {
                    if (!is_null($dta = $this->tmdb->searchMovie($moviename))) {
                        $poster = file_get_contents($this->tmdb->picturebase . $dta->poster_path);

                        // error handling for download error
                        if ($poster) {
                            $poster_base64 = 'data:image/jpeg;base64,' . base64_encode($poster);

                            $insert_query = "INSERT INTO videos(movie_name,movie_url,poster,thumbnail,quality,length) 
                            VALUES ('" . mysqli_real_escape_string($this->conn, $moviename) . "',
                            '" . mysqli_real_escape_string($this->conn, $this->videopath . $filename) . "',
                            '$backpic64',
                            '$poster_base64',
                            '$width',
                            '$duration')";
                        } else {
                            throw new Exception("faild to load pic");
                        }
                        // store genre ids for parsing later
                        $genres = $dta->genre_ids;
                    } else {
                        // nothing found with tmdb
                        $this->writeLog("nothing found with TMDB!\n");
                        throw new Exception("not found in tmdb");
                    }
                } catch (Exception $e) {
                    echo $e->getMessage();

                    $insert_query = "INSERT INTO videos(movie_name,movie_url,thumbnail,quality,length) 
                            VALUES ('" . mysqli_real_escape_string($this->conn, $moviename) . "',
                            '" . mysqli_real_escape_string($this->conn, $this->videopath . $filename) . "',
                            '$backpic64',
                            '$width',
                            '$duration')";
                }
            }

            if ($this->conn->query($insert_query) === TRUE) {
                echo('successfully added ' . $filename . " to video gravity\n");
                $this->writeLog('successfully added ' . $filename . " to video gravity\n");

                // add this entry to the default tags
                $last_id = $this->conn->insert_id;

                $this->insertSizeTag($width, $last_id);

                // handle tmdb genres here!
                if ($genres != -1) {
                    // transform genre ids in valid names
                    foreach ($genres as $genreid) {
                        // check if genre is already a tag in db if not insert it
                        $tagname = array_column($this->tmdbgenres, 'name', 'id')[$genreid];
                        $tagid = $this->tagExists($tagname);

                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,$tagid)";
                        if ($this->conn->query($query) !== TRUE) {
                            echo "failed to add $genreid tag here.\n";
                            $this->writeLog("failed to add $genreid tag here.\n");
                        }
                    }
                }


                $this->added++;
                $this->all++;
            } else {
                echo('errored item: ' . $filename . "\n");
                $this->writeLog('errored item: ' . $filename . "\n");
                echo('{"data":"' . $this->conn->error . '"}\n');
                $this->writeLog('{"data":"' . $this->conn->error . '"}\n');
                $this->failed++;
            }
        } else {
            $this->all++;
        }
    }

    /**
     * insert the corresponding videosize tag to a specific videoid
     */
    private function insertSizeTag($width, $videoid){
        // full hd
        if ($width >= 1900) {
            $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($videoid,2)";
            if ($this->conn->query($query) !== TRUE) {
                echo "failed to add default tag here.\n";
                $this->writeLog("failed to add default tag here.\n");
            }
        }

        // HD
        if ($width >= 1250 && $width < 1900) {
            $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($videoid,4)";
            if ($this->conn->query($query) !== TRUE) {
                echo "failed to add default tag here.\n";
                $this->writeLog("failed to add default tag here.\n");
            }
        }

        // SD
        if ($width < 1250 && $width > 0) {
            $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($videoid,3)";
            if ($this->conn->query($query) !== TRUE) {
                echo "failed to add default tag here.\n";
                $this->writeLog("failed to add default tag here.\n");
            }
        }
    }

    /**
     * get all videoinfos of a video file
     *
     * @param $video string name including extension
     * @return object all infos as object
     */
    private function _get_video_attributes($video) {
        $command = "mediainfo \"../$this->videopath$video\" --Output=JSON";
        $output = shell_exec($command);
        return json_decode($output);
    }

    /**
     * write a line to the output log file
     *
     * @param string $message message to write
     */
    public function writeLog(string $message) {
        file_put_contents("/tmp/output.log", $message, FILE_APPEND);
        flush();
    }

    /**
     * ckecks if tag exists -- if not creates it
     * @param string $tagname the name of the tag
     * @return integer the id of the inserted tag
     */
    private function tagExists(string $tagname) {
        global $conn;

        $query = "SELECT * FROM tags WHERE tag_name='$tagname'";

        $result = $conn->query($query);
        if ($result->num_rows == 0) {
            // tag does not exist --> create it
            $query = "INSERT INTO tags (tag_name) VALUES ('$tagname')";
            if ($conn->query($query) !== TRUE) {
                echo "failed to create $tagname tag in database\n";
                $this->writeLog("failed to create $tagname tag in database\n");
            }
            return $conn->insert_id;
        } else {
            return $result->fetch_assoc()['tag_id'];
        }
    }

    /**
     * cleans up the video gravity and removes non existent videos
     */
    public function cleanUpGravity() {
        // auto cleanup db entries
        $query = "SELECT COUNT(*) as count FROM videos";
        $result = $this->conn->query($query);
        $r = mysqli_fetch_assoc($result);

        if ($this->all < $r['count']) {
            echo "should be in gravity: " . $this->all . "\n";
            $this->writeLog("should be in gravity: " . $this->all . "\n");
            echo "really in gravity: " . $r['count'] . "\n";
            $this->writeLog("really in gravity: " . $r['count'] . "\n");
            echo "cleaning up gravity\n";
            $this->writeLog("cleaning up gravity\n");

            $query = "SELECT movie_id,movie_url FROM videos";
            $result = $this->conn->query($query);

            while ($r = mysqli_fetch_assoc($result)) {
                if (!file_exists("../" . $r['movie_url'])) {
                    $query = "SET foreign_key_checks = 0; DELETE FROM videos WHERE movie_id='" . $r['movie_id'] . "'";
                    if ($this->conn->query($query) === TRUE) {
                        echo('successfully deleted ' . $r['movie_url'] . " from video gravity\n");
                        $this->writeLog('successfully deleted ' . $r['movie_url'] . " from video gravity\n");
                        $deleted++;
                    } else {
                        echo "failed to delete " . $r['movie_url'] . " from gravity: " . $this->conn->error . "\n";
                        $this->writeLog("failed to delete " . $r['movie_url'] . " from gravity: " . $this->conn->error . "\n");
                    }
                }
            }
        }
    }
}
