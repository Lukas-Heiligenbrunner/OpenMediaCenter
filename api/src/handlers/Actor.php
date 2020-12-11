<?php
require_once __DIR__ . '/../SSettings.php';
require_once 'RequestBase.php';

class Actor extends RequestBase {

    function initHandlers() {
        $this->databaseAdds();
        $this->databaseRequests();
    }

    function databaseAdds() {
        $this->addActionHandler("createActor", function () {
            // skip tag create if already existing
            $actorname = $_POST["actorname"];

            $query = "INSERT IGNORE INTO actors (name) VALUES ('$actorname')";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });

        $this->addActionHandler("addActorToVideo", function () {
            // skip tag create if already existing
            $actorid = $_POST["actorid"];
            $videoid = $_POST["videoid"];

            $query = "INSERT IGNORE INTO actors_videos (actor_id, video_id) VALUES ($actorid,$videoid)";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });
    }

    function databaseRequests() {
        $this->addActionHandler("getAllActors", function () {
            // query the actors corresponding to video
            $query = "SELECT * FROM actors";
            $result = $this->conn->query($query);
            $this->commitMessage(json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC)));
        });

        $this->addActionHandler("getActorsOfVideo", function () {
            // query the actors corresponding to video
            $video_id = $_POST["videoid"];

            $query = "SELECT actor_id, name, thumbnail FROM actors_videos
                        JOIN actors a on actors_videos.actor_id = a.id
                        WHERE actors_videos.video_id=$video_id";
            $result = $this->conn->query($query);
            $this->commitMessage(json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC)));
        });

        $this->addActionHandler("getActorInfo", function (){
            $actorid = $_POST["actorid"];

            $query = "SELECT movie_id, movie_name FROM actors_videos
                        JOIN videos v on v.movie_id = actors_videos.video_id
                        WHERE actors_videos.actor_id=$actorid";
            $result = $this->conn->query($query);

            $reply = array("videos" => mysqli_fetch_all($result, MYSQLI_ASSOC));

            $this->commitMessage(json_encode($reply));
        });
    }
}
