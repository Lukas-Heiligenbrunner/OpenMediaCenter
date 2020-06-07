<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();

if (isset($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
        case "getAllTags":
            $query = "SELECT tag_name,tag_id from tags";

            $result = $conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }
            echo json_encode($rows);

            break;
        case "getRandomTagPreview":
            $id = $_POST['id'];

            $query = "SELECT thumbnail from videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        WHERE tag_id='$id' 
                        ORDER BY RAND()
                        LIMIT 1";

            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);

            echo $r['thumbnail'];

            break;
    }
}