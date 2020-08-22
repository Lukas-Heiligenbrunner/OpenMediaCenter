<?php
require_once './src/Database.php';
require_once './src/TMDBMovie.php';
require_once './src/SSettings.php';

class VideoParser {
    private string $ffmpeg = 'ffmpeg'; //or: /usr/bin/ffmpeg , or /usr/local/bin/ffmpeg - depends on your installation (type which ffmpeg into a console to find the install path)
    private TMDBMovie $tmdb;
// initial load of all available movie genres
    private $tmdbgenres;

    private $conn;

    private $settings;

    private $TMDBenabled;

    /**
     * VideoParser constructor.
     */
    public function __construct() {
        $this->tmdb = new TMDBMovie();
        $this->tmdbgenres = $this->tmdb->getAllGenres();
        $this->conn = Database::getInstance()->getConnection();

        $this->settings = new SSettings();
        $this->TMDBenabled = $this->settings->isTMDBGrabbingEnabled();;
    }


    public function processVideo($filename) {
        $moviename = substr($filename, 0, -4);

        $query = "SELECT * FROM videos WHERE movie_name = '" . mysqli_real_escape_string($conn, $moviename) . "'";
        $result = $conn->query($query);

        // insert if not available in db
        if (!mysqli_fetch_assoc($result)) {
            $genres = -1;
            $poster = -1; // initially disable poster supp
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
            $backpic = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");
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
                            VALUES ('" . mysqli_real_escape_string($conn, $moviename) . "',
                            '" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "',
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
                            VALUES ('" . mysqli_real_escape_string($conn, $moviename) . "',
                            '" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "',
                            '$backpic64',
                            '$width',
                            '$duration')";
                }
            }

            if ($conn->query($insert_query) === TRUE) {
                echo('successfully added ' . $elem . " to video gravity\n");
                $this->writeLog('successfully added ' . $elem . " to video gravity\n");

                // add this entry to the default tags
                $last_id = $conn->insert_id;

                // full hd
                if ($width >= 1900) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,2)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add default tag here.\n";
                        $this->writeLog("failed to add default tag here.\n");
                    }
                }

                // HD
                if ($width >= 1250 && $width < 1900) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,4)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add default tag here.\n";
                        $this->writeLog("failed to add default tag here.\n");
                    }
                }

                // SD
                if ($width < 1250 && $width > 0) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,3)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add default tag here.\n";
                        $this->writeLog("failed to add default tag here.\n");
                    }
                }

                // handle tmdb genres here!
                if ($genres != -1) {
                    // transform genre ids in valid names
                    foreach ($genres as $genreid) {
                        // check if genre is already a tag in db if not insert it
                        $tagname = array_column($tmdbgenres, 'name', 'id')[$genreid];
                        $tagid = tagExists($tagname);

                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,$tagid)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add $genreid tag here.\n";
                            $this->writeLog("failed to add $genreid tag here.\n");
                        }
                    }
                }


                $added++;
                $all++;
            } else {
                echo('errored item: ' . $elem . "\n");
                $this->writeLog('errored item: ' . $elem . "\n");
                echo('{"data":"' . $conn->error . '"}\n');
                $this->writeLog('{"data":"' . $conn->error . '"}\n');
                $failed++;
            }
        } else {
            $all++;
        }
    }

    /**
     * get all videoinfos of a video file
     *
     * @param $video string name including extension
     * @return object all infos as object
     */
    function _get_video_attributes($video) {
        $command = "mediainfo \"../videos/prn/$video\" --Output=JSON";
        $output = shell_exec($command);
        return json_decode($output);
    }

    /**
     * write a line to the output log file
     *
     * @param string $message message to write
     */
    function writeLog(string $message) {
        file_put_contents("/tmp/output.log", $message, FILE_APPEND);
        flush();
    }

    /**
     * ckecks if tag exists -- if not creates it
     * @param string $tagname the name of the tag
     * @return integer the id of the inserted tag
     */
    function tagExists(string $tagname) {
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
}
