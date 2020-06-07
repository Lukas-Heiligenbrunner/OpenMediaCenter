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
    }
}