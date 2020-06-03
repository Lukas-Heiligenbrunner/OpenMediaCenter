<?php

class Database
{
    private static $instance = null;
    private $conn;

    private $servername = "192.168.0.30";
    private $username = "root";
    private $password = "1qayxsw2";
    private $dbname = "mediacenter";

    // The db connection is established in the private constructor.
    private function __construct()
    {
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_errno) {
            echo "connecton failed... nr: " . $this->conn->connect_errno . " -- " . $this->conn->connect_error;
        }
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }
}
