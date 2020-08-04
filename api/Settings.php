<?php
require 'Database.php';
require 'SSettings.php';

$conn = Database::getInstance()->getConnection();
$settings = new SSettings();

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
            // booleans need to be set manually
            $r['passwordEnabled'] = $r['password'] != "-1";
            $r['TMDB_grabbing'] = ($r['TMDB_grabbing'] != '0');

            echo json_encode($r);
            break;
        case "saveGeneralSettings":
            $mediacentername = $_POST['mediacentername'];
            $password = $_POST['password'];
            $videopath = $_POST['videopath'];
            $tvshowpath = $_POST['tvshowpath'];
            $tmdbsupport = $_POST['tmdbsupport'];
            $darkmodeenabled = $_POST['darkmodeenabled'];

            $query = "UPDATE settings SET 
                        video_path='$videopath',
                        episode_path='$tvshowpath',
                        password='$password',
                        mediacenter_name='$mediacentername',
                        TMDB_grabbing=$tmdbsupport, 
                        DarkMode=$darkmodeenabled
                    WHERE 1";

            if ($conn->query($query) === true) {
                echo '{"success": true}';
            } else {
                echo '{"success": true}';
            }
            break;
        case "loadInitialData":
            $query = "SELECT * from settings";

            $result = $conn->query($query);
            if ($result->num_rows > 1) {
                // todo throw error
            }

            $r = mysqli_fetch_assoc($result);

            $r['passwordEnabled'] = $r['password'] != "-1";
            unset($r['password']);
            $r['DarkMode'] = (bool)($r['DarkMode'] != '0');
            echo json_encode($r);
            break;
    }
}
