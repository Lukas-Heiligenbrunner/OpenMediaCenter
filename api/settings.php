<?php
require 'Database.php';

$conn = Database::getInstance()->getConnection();


if (isset($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {
        case "isPasswordNeeded":
            echo '{"password": true}';
            break;
        case "checkPassword":

            break;
    }
}