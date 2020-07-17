<?php

class SSettings
{
    private ?Database $database;

    /**
     * SSettings constructor.
     */
    public function __construct() {
        $this->database = Database::getInstance();
    }

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
    public function isTMDBGrabbingEnabled(): bool
    {
        $query = "SELECT TMDB_grabbing from settings";

        $result = $this->database->getConnection()->query($query);
        if(!$result){
            return true; // if undefined in db --> default true
        }else{
            $r = mysqli_fetch_assoc($result);
            return $r['TMDB_grabbing'] == '1';
        }
    }
}