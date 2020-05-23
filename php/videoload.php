<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();


if (isset($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
        case "getMovies":
            $query = "SELECT movie_id,movie_name FROM videos ORDER BY likes DESC,movie_name ASC";
            $result = $conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows,$r);
            }

            echo(json_encode($rows));
            break;
        case "loadVideo":
            $query = "SELECT movie_url,thumbnail FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $conn->query($query);
            $row = $result->fetch_assoc();

            $arr = array();
            $arr["thumbnail"] = $row["thumbnail"];
            $arr["movie_url"] = $row["movie_url"];
            echo(json_encode($arr));

            break;
        case "getDbSize":
            $query = "SELECT table_schema AS \"Database\", 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS \"Size\" 
                        FROM information_schema.TABLES 
                        WHERE TABLE_SCHEMA='test'
                        GROUP BY table_schema;";
            $result = $conn->query($query);

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();

                echo '{"data":"' . $row["Size"] . '"}';
            }

            break;
        case "readThumbnail":
            $query = "SELECT thumbnail FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $conn->query($query);
            $row = $result->fetch_assoc();

            echo($row["thumbnail"]);

            break;
    }
} else {
    echo('{"data":"error"}');
}
return;

