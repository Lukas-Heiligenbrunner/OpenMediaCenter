<?php
require 'Database.php';
require 'TMDBMovie.php';

$ffmpeg = 'ffmpeg'; //or: /usr/bin/ffmpeg , or /usr/local/bin/ffmpeg - depends on your installation (type which ffmpeg into a console to find the install path)
$tmdb = new TMDBMovie();

$conn = Database::getInstance()->getConnection();

$scandir = "../videos/prn/";
$arr = scandir($scandir);

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
                    $pic = file_get_contents($tmdb->picturebase . $dta->poster_path);
                    $poster = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");

                    $genres = $dta->genre_ids;
                } else {
                    echo "nothing found with TMDB!\n";
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
                    $last_id = $conn->insert_id;

                    // full hd
                    if ($width >= 1900) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,2)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                        }
                    }

                    if ($width >= 1250 && $width < 1900) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,4)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                        }
                    }

                    if ($width < 1250) {
                        $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,3)";
                        if ($conn->query($query) !== TRUE) {
                            echo "failed to add default tag here.\n";
                        }
                    }

                    // handle tmdb genres here!
                    if($genres != -1){
                        foreach ($genres as $genre) {
                            // check if genre is already a tag in db
                            echo $genre."\n\n";
                        }
                    }


                    $added++;
                    $all++;
                } else {
                    echo('errored item: ' . $elem . "\n");
                    echo('{"data":"' . $conn->error . '"}\n');
                    $failed++;
                }
            } else {
                $all++;
            }
        } else {
            echo($elem . " does not contain a .mp4 extension! - skipping \n");
        }
    }
}

$query = "SELECT COUNT(*) as count FROM videos";
$result = $conn->query($query);
$r = mysqli_fetch_assoc($result);

if ($all < $r['count']) {
    echo "should be in gravity: " . $all . "\n";
    echo "really in gravity: " . $r['count'] . "\n";
    echo "cleaning up gravity\n";

    $query = "SELECT movie_id,movie_url FROM videos";
    $result = $conn->query($query);

    while ($r = mysqli_fetch_assoc($result)) {
        if (!file_exists("../" . $r['movie_url'])) {
            $query = "DELETE FROM videos WHERE movie_id='" . $r['movie_id'] . "'";
            if ($conn->query($query) === TRUE) {
                echo('successfully deleted ' . $r['movie_url'] . " from video gravity\n");
                $deleted++;
            } else {
                echo "failed to delete " . $r['movie_url'] . " from gravity: " . $conn->error . "\n";
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
echo "Size of Databse is: " . $size . "MB\n";
echo "added in this run: " . $added . "\n";
echo "deleted in this run: " . $deleted . "\n";
echo "errored in this run: " . $failed . "\n";

function _get_video_attributes($video)
{
    $command = "mediainfo \"../videos/prn/$video\" --Output=JSON";
    $output = shell_exec($command);
    return json_decode($output);
}
