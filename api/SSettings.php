<?php

class SSettings
{
    private $database;

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
}