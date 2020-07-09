<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();

if (isset($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
        case "loadGeneralSettings":
            $query = "SELECT * from settings";

            $result = $conn->query($query);
            if ($result->num_rows > 1) {
                // todo throw error
            }

            $r = mysqli_fetch_assoc($result);
            if ($r['password'] != "-1") {
                $r['passwordEnabled'] = true;
            } else {
                $r['passwordEnabled'] = true;
            }
            echo json_encode($r);
            break;
    }
}
