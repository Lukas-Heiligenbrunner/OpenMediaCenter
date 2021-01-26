<?php
require_once 'RequestBase.php';

/**
 * Class Tags
 * backend to handle Tag database interactions
 */
class Tags extends RequestBase {
    function initHandlers() {
        $this->addToDB();
        $this->getFromDB();
        $this->delete();
    }

    private function addToDB() {
        /**
         * creates a new tag
         * query requirements:
         * * tagname -- name of the new tag
         */
        $this->addActionHandler("createTag", function () {
            // skip tag create if already existing
            $query = "INSERT IGNORE INTO tags (tag_name) VALUES ('" . $_POST['tagname'] . "')";

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

            // skip tag add if already assigned
            $query = "INSERT IGNORE INTO video_tags(tag_id, video_id) VALUES ('$tagid','$movieid')";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                $this->commitMessage('{"result":"' . $this->conn->error . '"}');
            }
        });
    }

    private function getFromDB() {
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
    }

    private function delete() {
        /**
         * delete a Tag with specified id
         */
        $this->addActionHandler("deleteTag", function () {
            $tag_id = $_POST['tagId'];
            $force = $_POST['force'];

            // delete key constraints first
            if ($force === "true") {
                $query = "DELETE FROM video_tags WHERE tag_id=$tag_id";

                if ($this->conn->query($query) !== TRUE) {
                    $this->commitMessage('{"result":"' . $this->conn->error . '"}');
                }
            }

            $query = "DELETE FROM tags WHERE tag_id=$tag_id";

            if ($this->conn->query($query) === TRUE) {
                $this->commitMessage('{"result":"success"}');
            } else {
                // check if error is a constraint error
                if (preg_match('/^.*a foreign key constraint fails.*$/i', $this->conn->error)) {
                    $this->commitMessage('{"result":"not empty tag"}');
                } else {
                    $this->commitMessage('{"result":"' . $this->conn->eror . '"}');
                }
            }
        });
    }
}
