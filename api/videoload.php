<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();

//$_POST['action'] = "getRandomMovies";$_POST['number'] =6;
if (isset($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
        case "getMovies":
            $query = "SELECT movie_id,movie_name FROM videos ORDER BY likes DESC, create_date ASC, movie_name ASC";
            if (isset($_POST['tag'])) {
                $tag = $_POST['tag'];
                if ($_POST['tag'] != "all") {
                    $query = "SELECT movie_id,movie_name FROM videos 
                            INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                            INNER JOIN tags t on vt.tag_id = t.tag_id
                            WHERE t.tag_name = '$tag'
                            ORDER BY likes DESC, create_date ASC, movie_name ASC";
                }
            }
            $result = $conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }

            echo(json_encode($rows));
            break;
        case "getRandomMovies":
            $return = new stdClass();
            $query = "SELECT movie_id,movie_name FROM videos ORDER BY RAND() LIMIT " . $_POST['number'];
            $result = $conn->query($query);
            $return->rows = array();

            // get tags of random videos
            $ids = [];
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($return->rows, $r);
                array_push($ids,"video_tags.video_id=".$r['movie_id']);
            }

            $idstring = implode(" OR ",$ids);

            $return->tags = array();
            $query = "SELECT t.tag_name FROM video_tags 
                        INNER JOIN tags t on video_tags.tag_id = t.tag_id
                        WHERE $idstring
                        GROUP BY t.tag_name";
            $result = $conn->query($query);
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($return->tags, $r);
            }

            echo(json_encode($return));
            break;
        case "loadVideo":
            $query = "SELECT movie_name,movie_url,thumbnail,likes,quality,length FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $conn->query($query);
            $row = $result->fetch_assoc();

            $arr = array();
            $arr["thumbnail"] = $row["thumbnail"];
            $arr["movie_name"] = $row["movie_name"];
            $arr["movie_url"] = $row["movie_url"];
            $arr["likes"] = $row["likes"];
            $arr["quality"] = $row["quality"];
            $arr["length"] = $row["length"];

            // load tags of this video
            $arr['tags'] = Array();
            $query = "SELECT t.tag_name FROM video_tags 
                        INNER JOIN tags t on video_tags.tag_id = t.tag_id
                        WHERE video_tags.video_id=".$_POST['movieid']."
                        GROUP BY t.tag_name";
            $result = $conn->query($query);
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($arr['tags'], $r);
            }

            echo(json_encode($arr));

            break;
        case "getDbSize":
            $query = "SELECT table_schema AS \"Database\", 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS \"Size\" 
                        FROM information_schema.TABLES 
                        WHERE TABLE_SCHEMA='hub'
                        GROUP BY table_schema;";
            $result = $conn->query($query);

            if ($result->num_rows == 1) {
                $row = $result->fetch_assoc();
                echo '{"data":"' . $row["Size"] . 'MB"}';
            }

            break;
        case "readThumbnail":
            $query = "SELECT thumbnail FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $conn->query($query);
            $row = $result->fetch_assoc();

            echo($row["thumbnail"]);

            break;
        case "getTags":
            // todo add this to loadVideo maybe
            $movieid = $_POST['movieid'];

            $query = "SELECT tag_name FROM video_tags 
                        INNER JOIN tags t on video_tags.tag_id = t.tag_id 
                        WHERE video_id='$movieid'";

            $result = $conn->query($query);

            $rows = array();
            $rows['tags'] = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows['tags'], $r['tag_name']);
            }

            echo(json_encode($rows));
            break;
        case "addLike":
            $movieid = $_POST['movieid'];

            $query = "update videos set likes = likes + 1 where movie_id = '$movieid'";

            if ($conn->query($query) === TRUE) {
                echo('{"result":"success"}');
            } else {
                echo('{"result":"' . $conn->error . '"}');
            }
            break;
        case "getStartData":
            $query = "SELECT COUNT(*) as nr FROM videos";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);

            $arr = array();
            $arr['total'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['tagged'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='hd'";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['hd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='fullhd'";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['fullhd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='lowquality'";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['sd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM tags";
            $result = $conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['tags'] = $r['nr'];

            echo(json_encode($arr));
            break;
    }
} else {
    echo('{"data":"error"}');
}
return;
