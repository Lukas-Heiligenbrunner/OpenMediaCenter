<?php
require_once 'RequestBase.php';

/**
 * Class Tags
 * backend to handle Tag database interactions
 */
class Tags extends RequestBase {
    function initHandlers() {
        /**
         * returns all available tags from database
         */
        $this->addActionHandler("getAllTags", function () {
            $query = "SELECT tag_name,tag_id from tags";
            $result = $this->conn->query($query);

            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }
            $this->commitMessage(json_encode($rows));
        });

        /**
         * creates a new tag
         * query requirements:
         * * tagname -- name of the new tag
         */
        $this->addActionHandler("createTag", function () {
            $query = "INSERT INTO tags (tag_name) VALUES ('" . $_POST['tagname'] . "')";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });

        /**
         * adds a new tag to an existing video
         *
         * query requirements:
         * * movieid  -- the id of the video to add the tag to
         * * id -- the tag id which tag to add
         */
        $this->addActionHandler("addTag", function () {
            $movieid = $_POST['movieid'];
            $tagid = $_POST['id'];

            $query = "INSERT INTO video_tags(tag_id, video_id) VALUES ('$tagid','$movieid')";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });
    }
}
