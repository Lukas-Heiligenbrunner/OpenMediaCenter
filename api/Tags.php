<?php
require_once 'RequestBase.php';

class Tags extends RequestBase {
    function initHandlers() {
        $this->addActionHandler("getAllTags", function () {
            $query = "SELECT tag_name,tag_id from tags";

            $result = $this->conn->query($query);
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                array_push($rows, $r);
            }
            echo json_encode($rows);
        });

        $this->addActionHandler("createTag", function (){
            $query = "INSERT INTO tags (tag_name) VALUES ('" . $_POST['tagname'] . "')";

            if ($this->conn->query($query) === TRUE) {
                echo('{"result":"success"}');
            } else {
                echo('{"result":"' . $this->conn->error . '"}');
            }
        });
    }
}

$tags = new Tags();
$tags->handleAction();
