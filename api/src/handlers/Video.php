<?php
require_once 'src/SSettings.php';
require_once 'RequestBase.php';

/**
 * Class Video
 * backend for all interactions with videoloads and receiving of video infos
 */
class Video extends RequestBase {
    private string $videopath;

    public function __construct() {
        $settings = new SSettings();
        // load video path from settings
        $this->videopath = $settings->getVideoPath();
    }

    function initHandlers() {
        $this->getVideos();
        $this->loadVideos();
        $this->addToVideo();
    }

    /**
     * function handles load of all videos and search for videos
     */
    private function getVideos() {
        $this->addActionHandler("getMovies", function () {
            $query = "SELECT movie_id,movie_name FROM videos ORDER BY create_date DESC, movie_name";
            if (isset($_POST['tag'])) {
                $tag = $_POST['tag'];
                if ($_POST['tag'] != "all") {
                    $query = "SELECT movie_id,movie_name FROM videos 
                            INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                            INNER JOIN tags t on vt.tag_id = t.tag_id
                            WHERE t.tag_name = '$tag'
                            ORDER BY likes DESC, create_date, movie_name";
                }
            }
            $result = $this->conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }

            $this->commitMessage(json_encode($rows));
        });

        $this->addActionHandler("getRandomMovies", function () {
            $return = new stdClass();
            $query = "SELECT movie_id,movie_name FROM videos ORDER BY RAND() LIMIT " . $_POST['number'];
            $result = $this->conn->query($query);
            $return->rows = array();

            // get tags of random videos
            $ids = [];
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($return->rows, $r);
                array_push($ids, "video_tags.video_id=" . $r['movie_id']);
            }

            $idstring = implode(" OR ", $ids);

            $return->tags = array();
            $query = "SELECT t.tag_name FROM video_tags 
                        INNER JOIN tags t on video_tags.tag_id = t.tag_id
                        WHERE $idstring
                        GROUP BY t.tag_name";
            $result = $this->conn->query($query);
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($return->tags, $r);
            }

            $this->commitMessage(json_encode($return));
        });

        $this->addActionHandler("getSearchKeyWord", function () {
            $search = $_POST['keyword'];

            $query = "SELECT movie_id,movie_name FROM videos 
                        WHERE movie_name LIKE '%$search%'
                        ORDER BY likes DESC, create_date DESC, movie_name";
            $result = $this->conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }

            $this->commitMessage(json_encode($rows));
        });
    }

    /**
     * function to handle stuff for loading specific videos and startdata
     */
    private function loadVideos() {
        $this->addActionHandler("loadVideo", function () {
            $query = "  SELECT movie_name,movie_id,movie_url,thumbnail,poster,likes,quality,length 
                        FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $this->conn->query($query);
            $row = $result->fetch_assoc();

            $arr = array();
            if ($row["poster"] == null) {
                $arr["thumbnail"] = $row["thumbnail"];
            } else {
                $arr["thumbnail"] = $row["poster"];
            }

            $arr["movie_id"] = $row["movie_id"];
            $arr["movie_name"] = $row["movie_name"];
            // todo drop video url from db -- maybe one with and one without extension
            // extension hardcoded here!!!
            $arr["movie_url"] = str_replace("?", "%3F", $this->videopath . $row["movie_name"] . ".mp4");
            $arr["likes"] = $row["likes"];
            $arr["quality"] = $row["quality"];
            $arr["length"] = $row["length"];

            // load tags of this video
            $arr['tags'] = array();
            $query = "SELECT t.tag_name FROM video_tags 
                        INNER JOIN tags t on video_tags.tag_id = t.tag_id
                        WHERE video_tags.video_id=" . $_POST['movieid'] . "
                        GROUP BY t.tag_name";
            $result = $this->conn->query($query);
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($arr['tags'], $r);
            }

            // get the random predict tags
            $arr['suggesttag'] = array();
            $query = "SELECT * FROM tags
                        order by rand()
                        LIMIT 5";
            $result = $this->conn->query($query);
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($arr['suggesttag'], $r);
            }

            $this->commitMessage(json_encode($arr));
        });

        $this->addActionHandler("readThumbnail", function () {
            $query = "SELECT thumbnail FROM videos WHERE movie_id='" . $_POST['movieid'] . "'";

            $result = $this->conn->query($query);
            $row = $result->fetch_assoc();

            $this->commitMessage($row["thumbnail"]);
        });

        $this->addActionHandler("getStartData", function () {
            $query = "SELECT COUNT(*) as nr FROM videos";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);

            $arr = array();
            $arr['total'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['tagged'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='hd'";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['hd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='fullhd'";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['fullhd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='lowquality'";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['sd'] = $r['nr'];

            $query = "SELECT COUNT(*) as nr FROM tags";
            $result = $this->conn->query($query);
            $r = mysqli_fetch_assoc($result);
            $arr['tags'] = $r['nr'];

            $this->commitMessage(json_encode($arr));
        });
    }

    /**
     * function to handle api handlers for stuff to add to video or database
     */
    private function addToVideo() {
        $this->addActionHandler("addLike", function () {
            $movieid = $_POST['movieid'];

            $query = "update videos set likes = likes + 1 where movie_id = '$movieid'";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });
    }
}
