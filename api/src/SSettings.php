<?php

/**
 * Class SSettings
 * class handling all Settings used by php scripts
 */
class SSettings {
    private ?Database $database;

    /**
     * SSettings constructor.
     */
    public function __construct() {
        $this->database = Database::getInstance();
    }

    /**
     * get the videopath saved in db
     * @return string videopath
     */
    public function getVideoPath() {
        $query = "SELECT video_path from settings";

        $result = $this->database->getConnection()->query($query);

        $r = mysqli_fetch_assoc($result);
        return $r['video_path'];
    }

    /**
     * check if TMDB is enableds
     * @return bool isenabled?
     */
    public function isTMDBGrabbingEnabled(): bool {
        $query = "SELECT TMDB_grabbing from settings WHERE 1";

        $result = $this->database->getConnection()->query($query);
        if (!$result) {
            return true; // if undefined in db --> default true
        } else {
            $r = mysqli_fetch_assoc($result);
            return $r['TMDB_grabbing'] == '1';
        }
    }
}
