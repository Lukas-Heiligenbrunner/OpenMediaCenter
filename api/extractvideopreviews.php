<?php
require 'Database.php';
$ffmpeg = 'ffmpeg'; //or: /usr/bin/ffmpeg , or /usr/local/bin/ffmpeg - depends on your installation (type which ffmpeg into a console to find the install path)

$conn = Database::getInstance()->getConnection();

$arr = scandir("../videos/prn/");

$all = 0;
$added = 0;
$deleted = 0;
$failed = 0;

foreach ($arr as $elem) {
    if ($elem != "." && $elem != "..") {

        $query = "SELECT * FROM videos WHERE movie_name = '" . mysqli_real_escape_string($conn, $elem) . "'";
        $result = $conn->query($query);

        // insert if not available in db
        if (!mysqli_fetch_assoc($result)) {
            $pic = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");

            $image_base64 = base64_encode($pic);

            $image = 'data:image/jpeg;base64,' . $image_base64;

            $video_attributes = _get_video_attributes($elem);

            $duration = 60 * $video_attributes['hours'] + $video_attributes['mins'];

            $query = "INSERT INTO videos(movie_name,movie_url,thumbnail,quality,length) 
                            VALUES ('" . mysqli_real_escape_string($conn, $elem) . "',
                            '" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "',
                            '$image',
                            '" . $video_attributes['height'] . "',
                            '$duration')";

            if ($conn->query($query) === TRUE) {
                echo('successfully added ' . $elem . " to video gravity\n");
                $last_id = $conn->insert_id;

                // full hd
                if ($video_attributes['height'] >= 1080) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,2)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add tag here.\n";
                    }
                }

                if ($video_attributes['height'] >= 720 && $video_attributes['height'] < 1080) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,4)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add tag here.\n";
                    }
                }

                if ($video_attributes['height'] < 720) {
                    $query = "INSERT INTO video_tags(video_id,tag_id) VALUES ($last_id,3)";
                    if ($conn->query($query) !== TRUE) {
                        echo "failed to add tag here.\n";
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
                        WHERE TABLE_SCHEMA='hub'
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
    global $ffmpeg;

    $command = "$ffmpeg -i \"../videos/prn/$video\" -vstats 2>&1";
    $output = shell_exec($command);

    $regex_sizes = "/Video: ([^,]*), ([^,]*), ([0-9]{1,4})x([0-9]{1,4})/"; // or : $regex_sizes = "/Video: ([^\r\n]*), ([^,]*), ([0-9]{1,4})x([0-9]{1,4})/"; (code from @1owk3y)
    if (preg_match($regex_sizes, $output, $regs)) {
        $codec = $regs [1] ? $regs [1] : null;
        $width = $regs [3] ? $regs [3] : null;
        $height = $regs [4] ? $regs [4] : null;
    }

    $regex_duration = "/Duration: ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}).([0-9]{1,2})/";
    if (preg_match($regex_duration, $output, $regs)) {
        $hours = $regs [1] ? $regs [1] : null;
        $mins = $regs [2] ? $regs [2] : null;
        $secs = $regs [3] ? $regs [3] : null;
        $ms = $regs [4] ? $regs [4] : null;
    }

    return array('codec' => $codec,
        'width' => $width,
        'height' => $height,
        'hours' => $hours,
        'mins' => $mins,
        'secs' => $secs,
        'ms' => $ms
    );
}
