<?php
require_once './src/Database.php';
require_once './src/TMDBMovie.php';
require_once './src/SSettings.php';
require_once './src/VideoParser.php';

$vp = new VideoParser();

// allow UTF8 characters
setlocale(LC_ALL, 'en_US.UTF-8');

$vp->writeLog("starting extraction!\n");


echo("TMDB grabbing is " . ($TMDBenabled ? "" : "not") . " enabled \n");

// load video path from settings
$scandir = "../" . $settings->getVideoPath();
$arr = scandir($scandir);

$all = 0;
$added = 0;
$deleted = 0;
$failed = 0;

foreach ($arr as $elem) {
    $ext = pathinfo($elem, PATHINFO_EXTENSION);
    if ($ext == "mp4") {
        $vp->processVideo($elem);
    } else {
        echo($elem . " does not contain a .mp4 extension! - skipping \n");
        writeLog($elem . " does not contain a .mp4 extension! - skipping \n");
    }
}

// auto cleanup db entries
$query = "SELECT COUNT(*) as count FROM videos";
$result = $conn->query($query);
$r = mysqli_fetch_assoc($result);

if ($all < $r['count']) {
    echo "should be in gravity: " . $all . "\n";
    $vp->writeLog("should be in gravity: " . $all . "\n");
    echo "really in gravity: " . $r['count'] . "\n";
    $vp->writeLog("really in gravity: " . $r['count'] . "\n");
    echo "cleaning up gravity\n";
    $vp->writeLog("cleaning up gravity\n");

    $query = "SELECT movie_id,movie_url FROM videos";
    $result = $conn->query($query);

    while ($r = mysqli_fetch_assoc($result)) {
        if (!file_exists("../" . $r['movie_url'])) {
            $query = "SET foreign_key_checks = 0; DELETE FROM videos WHERE movie_id='" . $r['movie_id'] . "'";
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
$vp->writeLog("Total gravity: " . $all . "\n");
echo "Size of Databse is: " . $size . "MB\n";
$vp->writeLog("Size of Databse is: " . $size . "MB\n");
echo "added in this run: " . $added . "\n";
$vp->writeLog("added in this run: " . $added . "\n");
echo "deleted in this run: " . $deleted . "\n";
$vp->writeLog("deleted in this run: " . $deleted . "\n");
echo "errored in this run: " . $failed . "\n";
$vp->writeLog("errored in this run: " . $failed . "\n");

$vp->writeLog("-42"); // terminating characters to stop webui requesting infos
