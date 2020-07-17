<?php
require 'Database.php';
require 'TMDBMovie.php';
require 'SSettings.php';

writeLog("starting extraction!\n");

$ffmpeg = 'ffmpeg'; //or: /usr/bin/ffmpeg , or /usr/local/bin/ffmpeg - depends on your installation (type which ffmpeg into a console to find the install path)
$tmdb = new TMDBMovie();
// initial load of all available movie genres
$tmdbgenres = $tmdb->getAllGenres();

$conn = Database::getInstance()->getConnection();
$settings = new SSettings();

// load video path from settings
$scandir = "../" . $settings->getVideoPath();
$arr = scandir($scandir);
$TMDB_enabled = $settings->isTMDBGrabbingEnabled();

$all = 0;
$added = 0;
$deleted = 0;
$failed = 0;

foreach ($arr as $elem) {
    if ($elem != "." && $elem != "..") {
        if (strpos($elem, '.mp4') !== false) {
            $moviename = substr($elem, 0, -4);

            $query = "SELECT * FROM videos WHERE movie_name = '" . mysqli_real_escape_string($conn, $moviename) . "'";
            $result = $conn->query($query);

            // insert if not available in db
            if (!mysqli_fetch_assoc($result)) {
                // try to fetch data from TMDB
                $poster = -1;
                $genres = -1;
                if (!is_null($dta = $tmdb->searchMovie($moviename))) {
                    $poster = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");

                    // check if tmdb support is enabled
                    if ($TMDB_enabled) {
                        $pic = file_get_contents($tmdb->picturebase . $dta->poster_path);

                        // error handling for download error
                        if (!$pic) {
                            $pic = $poster;
                            $poster = -1;
                            echo "Failed to load Picture from TMDB!  \n";
                        }
                    } else {
                        $pic = $poster;
                        $poster = -1;
                    }

                    $genres = $dta->genre_ids;
                } else {
                    echo "nothing found with TMDB!\n";
                    writeLog("nothing found with TMDB!\n");
                    $pic = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");
                }

                //convert video to base64
                $image_base64 = base64_encode($pic);
                // add base64 fileinfo
                $image = 'data:image/jpeg;base64,' . $image_base64;

                // extract other video attributes
                $video_attributes = _get_video_attributes($elem);
                $duration = 0;
                $size = 0;
                $width = 0;

                if ($video_attributes) {
                    $duration = $video_attributes->media->track[0]->Duration; // in seconds
                    $size = $video_attributes->media->track[0]->FileSize; // in Bytes
                    $width = $video_attributes->media->track[1]->Width; // width
                }


                if ($poster != -1) {
                    $poster_base64 = 'data:image/jpeg;base64,' . base64_encode($poster);

                    $query = "INSERT INTO videos(movie_name,movie_url,poster,thumbnail,quality,length) 
                            VALUES ('" . mysqli_real_escape_string($conn, $moviename) . "',
                            '" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "',
                            '$poster_base64',
                            '$image',
                            '$width',
                            '$duration')";
                } else {
                    $query = "INSERT INTO videos(movie_name,movie_url,thumbnail,quality,length) 
                            VALUES ('" . mysqli_real_escape_string($conn, $moviename) . "',
                            '" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "',
                            '$image',
                            '$width',
                            '$duration')";
                }


                if ($conn->query($query) === TRUE) {
                    echo('successfully added ' . $elem . " to video gravity\n");
                    writeLog('successfully added ' . $elem . " to video gravity\n");

                    // add this entry to the default tags
                    $last_id = $conn->insert_id;

                    // full hd
                    if ($width >= 1900) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,2)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                            writeLog("failed to add default tag here.\n");
                        }
                    }

                    // HD
                    if ($width >= 1250 && $width < 1900) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,4)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                            writeLog("failed to add default tag here.\n");
                        }
                    }

                    // SD
                    if ($width < 1250 && $width > 0) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,3)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                            writeLog("failed to add default tag here.\n");
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
                                writeLog("failed to add $genreid tag here.\n");
                            }
                        }
                    }


                    $added++;
                    $all++;
                } else {
                    echo('errored item: ' . $elem . "\n");
                    writeLog('errored item: ' . $elem . "\n");
                    echo('{"data":"' . $conn->error . '"}\n');
                    writeLog('{"data":"' . $conn->error . '"}\n');
                    $failed++;
                }
            } else {
                $all++;
            }
        } else {
            echo($elem . " does not contain a .mp4 extension! - skipping \n");
            writeLog($elem . " does not contain a .mp4 extension! - skipping \n");
        }
    }
}

// auto cleanup db entries
$query = "SELECT COUNT(*) as count FROM videos";
$result = $conn->query($query);
$r = mysqli_fetch_assoc($result);

if ($all < $r['count']) {
    echo "should be in gravity: " . $all . "\n";
    writeLog("should be in gravity: " . $all . "\n");
    echo "really in gravity: " . $r['count'] . "\n";
    writeLog("really in gravity: " . $r['count'] . "\n");
    echo "cleaning up gravity\n";
    writeLog("cleaning up gravity\n");

    $query = "SELECT movie_id,movie_url FROM videos";
    $result = $conn->query($query);

    while ($r = mysqli_fetch_assoc($result)) {
        if (!file_exists("../" . $r['movie_url'])) {
            $query = "DELETE FROM videos WHERE movie_id='" . $r['movie_id'] . "'";
            if ($conn->query($query) === TRUE) {
                echo('successfully deleted ' . $r['movie_url'] . " from video gravity\n");
                writeLog('successfully deleted ' . $r['movie_url'] . " from video gravity\n");
                $deleted++;
            } else {
                echo "failed to delete " . $r['movie_url'] . " from gravity: " . $conn->error . "\n";
                writeLog("failed to delete " . $r['movie_url'] . " from gravity: " . $conn->error . "\n");
            }
        }
    }
}

// calculate size of databse here
$size = -1;
$query = "SELECT table_schema AS \"Database\", 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 3) AS \"Size\" 
                        FROM information_schema.TABLES 
                        WHERE TABLE_SCHEMA='" . Database::getInstance()->getDatabaseName() . "'
                        GROUP BY table_schema;";
$result = $conn->query($query);
if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $size = $row["Size"];
}

echo "Total gravity: " . $all . "\n";
writeLog("Total gravity: " . $all . "\n");
echo "Size of Databse is: " . $size . "MB\n";
writeLog("Size of Databse is: " . $size . "MB\n");
echo "added in this run: " . $added . "\n";
writeLog("added in this run: " . $added . "\n");
echo "deleted in this run: " . $deleted . "\n";
writeLog("deleted in this run: " . $deleted . "\n");
echo "errored in this run: " . $failed . "\n";
writeLog("errored in this run: " . $failed . "\n");

writeLog("-42"); // terminating characters to stop webui requesting infos

/**
 * get all videoinfos of a video file
 *
 * @param $video string name including extension
 * @return object all infos as object
 */
function _get_video_attributes($video)
{
    $command = "mediainfo \"../videos/prn/$video\" --Output=JSON";
    $output = shell_exec($command);
    return json_decode($output);
}

/**
 * write a line to the output log file
 *
 * @param string $message message to write
 */
function writeLog(string $message)
{
    file_put_contents("/tmp/output.log", $message, FILE_APPEND);
    flush();
}

/**
 * ckecks if tag exists -- if not creates it
 * @param string $tagname the name of the tag
 * @return integer the id of the inserted tag
 */
function tagExists(string $tagname)
{
    global $conn;

    $query = "SELECT * FROM tags WHERE tag_name='$tagname'";

    $result = $conn->query($query);
    if ($result->num_rows == 0) {
        // tag does not exist --> create it
        $query = "INSERT INTO tags (tag_name) VALUES ('$tagname')";
        if ($conn->query($query) !== TRUE) {
            echo "failed to create $tagname tag in database\n";
            writeLog("failed to create $tagname tag in database\n");
        }
        return $conn->insert_id;
    } else {
        return $result->fetch_assoc()['tag_id'];
    }
}
