<?php
require_once 'RequestBase.php';
require_once __DIR__ . '/../VideoParser.php';

/**
 * Class Settings
 * Backend for the Settings page
 */
class Settings extends RequestBase {
    function initHandlers() {
        $this->getFromDB();
        $this->saveToDB();
        $this->reIndexHandling();
    }

    /**
     * handle settings stuff to load from db
     */
    private function getFromDB() {
        /**
         * load currently set settings form db for init of settings page
         */
        $this->addActionHandler("loadGeneralSettings", function () {
            // query settings and infotile values
            $query = "
                SELECT (
                           SELECT COUNT(*)
                           FROM videos
                       ) AS videonr,
                       (
                           SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS Size
                           FROM information_schema.TABLES
                           WHERE TABLE_SCHEMA = '" . Database::getInstance()->getDatabaseName() . "'
                           GROUP BY table_schema
                       ) AS dbsize,
                       (
                           SELECT COUNT(*)
                           FROM tags
                       ) AS difftagnr,
                       (
                           SELECT COUNT(*)
                           FROM video_tags
                       ) AS tagsadded,
                       settings.*
                FROM settings
                LIMIT 1
                ";

            $result = $this->conn->query($query);

            $r = mysqli_fetch_assoc($result);
            // booleans need to be set manually
            $r['passwordEnabled'] = $r['password'] != "-1";
            $r['TMDB_grabbing'] = ($r['TMDB_grabbing'] != '0');

            echo json_encode($r);
        });

        /**
         * load initial data for home page load to check if pwd is set
         */
        $this->addActionHandler("loadInitialData", function () {
            $query = "SELECT * from settings";

            $result = $this->conn->query($query);

            $r = mysqli_fetch_assoc($result);

            $r['passwordEnabled'] = $r['password'] != "-1";
            unset($r['password']);
            $r['DarkMode'] = (bool)($r['DarkMode'] != '0');
            $this->commitMessage(json_encode($r));
        });
    }

    /**
     * handle setting stuff to save to db
     */
    private function saveToDB() {
        /**
         * save changed settings to db
         */
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
                $this->commitMessage('{"success": true}');
            } else {
                $this->commitMessage('{"success": true}');
            }
        });
    }

    /**
     * methods for handling reindexing and cleanup of db gravity
     */
    private function reIndexHandling() {
        $this->addActionHandler("startReindex", function () {
            $indexrunning = false;
            if (file_exists("/tmp/output.log")) {

                $out = file_get_contents("/tmp/output.log");
                if (substr($out, -strlen("-42")) == "-42") {
                    unlink("/tmp/output.log");
                } else {
                    $indexrunning = true;
                }
            }

            if (!$indexrunning) {
                // start extraction of video previews in background

                $cmd = 'php extractvideopreviews.php';
                exec(sprintf("%s > %s 2>&1 & echo $! >> %s", $cmd, '/dev/zero', '/tmp/openmediacenterpid'));

                $this->commitMessage('{"success": true}');
            } else {
                $this->commitMessage('{"success": false}');
            }
        });

        $this->addActionHandler("cleanupGravity", function () {
            $vp = new VideoParser();
            $vp->cleanUpGravity();
        });

        $this->addActionHandler("getStatusMessage", function () {
            $return = new stdClass();
            if (file_exists("/tmp/output.log")) {
                $out = file_get_contents("/tmp/output.log");
                // clear log file
                file_put_contents("/tmp/output.log", "");
                $return->message = $out;
                $return->contentAvailable = true;

                if (substr($out, -strlen("-42")) == "-42") {
                    unlink("/tmp/output.log");
                }
            } else {
                $return->contentAvailable = false;
            }

            $this->commitMessage(json_encode($return));
        });
    }
}
