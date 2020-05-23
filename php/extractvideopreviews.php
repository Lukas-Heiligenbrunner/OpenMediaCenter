<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();

$arr = scandir("../videos/prn/");

$all = 0;
$added = 0;
$failed = 0;

foreach ($arr as $elem) {
    if ($elem != "." && $elem != "..") {

        $query = "SELECT * FROM videos WHERE movie_name = '" . mysqli_real_escape_string($conn, $elem) . "'";
        $result = $conn->query($query);
        if (!mysqli_fetch_assoc($result)) {
            $pic = shell_exec("ffmpeg -hide_banner -loglevel panic -ss 00:04:00 -i \"../videos/prn/$elem\" -vframes 1 -q:v 2 -f singlejpeg pipe:1 2>/dev/null");

            $image_base64 = base64_encode($pic);

            $image = 'data:image/jpeg;base64,' . $image_base64;
            $conn = Database::getInstance()->getConnection();

            $query = "INSERT INTO videos(movie_name,movie_url,thumbnail) VALUES ('" . mysqli_real_escape_string($conn, $elem) . "','" . mysqli_real_escape_string($conn, 'videos/prn/' . $elem) . "','$image')";

            if ($conn->query($query) === TRUE) {
                echo('successfully added ' . $elem . " to video gravity\n");
                $added++;
            } else {
                echo('{"data":"' . $conn->error . '"}');
                $failed++;
            }
        }
        $all++;
    }
}

echo "Total gravity: " . $all . "\n";
echo "added in this run: " . $added . "\n";
echo "errored in this run: " . $failed . "\n";
