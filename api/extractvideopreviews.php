<?php
require 'Database.php';

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
            $conn = Database::getInstance()->getConnection();

            $query = "INSERT INTO videos(movie_name,movie_url,thumbnail) VALUES ('" . mysqli_real_escape_string($conn, $elem) . "','" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "','$image')";

            if ($conn->query($query) === TRUE) {
                echo('successfully added ' . $elem . " to video gravity\n");
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