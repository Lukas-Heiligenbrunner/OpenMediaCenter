<?php
require 'RequestBase.php';

/**
 * Class Settings
 * Backend for the Settings page
 */
class Settings extends RequestBase {
    function initHandlers() {
        $this->addActionHandler("loadGeneralSettings", function () {
            $query = "SELECT * from settings";

            $result = $this->conn->query($query);

            $r = mysqli_fetch_assoc($result);
            // booleans need to be set manually
            $r['passwordEnabled'] = $r['password'] != "-1";
            $r['TMDB_grabbing'] = ($r['TMDB_grabbing'] != '0');

            echo json_encode($r);
        });

        $this->addActionHandler("saveGeneralSettings", function () {
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

            if ($this->conn->query($query) === true) {
                echo '{"success": true}';
            } else {
                echo '{"success": true}';
            }
        });

        $this->addActionHandler("loadInitialData", function () {
            $query = "SELECT * from settings";

            $result = $this->conn->query($query);

            $r = mysqli_fetch_assoc($result);

            $r['passwordEnabled'] = $r['password'] != "-1";
            unset($r['password']);
            $r['DarkMode'] = (bool)($r['DarkMode'] != '0');
            echo json_encode($r);
        });
    }
}

$sett = new Settings();
$sett->handleAction();
