<?php

/**
 * Class Database
 *
 * Class with all neccessary stuff for the Database connections.
 */
class Database
{
    private static ?Database $instance = null;
    private mysqli $conn;

    private string $servername = "192.168.0.30";
    private string $username = "root";
    private string $password = "1qayxsw2";
    private string $dbname = "mediacenter";

    // The db connection is established in the private constructor.
    private function __construct()
    {
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_errno) {
            echo "connecton failed... nr: " . $this->conn->connect_errno . " -- " . $this->conn->connect_error;
        }
    }

    /**
     * get an instance of this database class
     * (only possible way to retrieve an object)
     *
     * @return Database dbobject
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    /**
     * get a connection instance of the database
     *
     * @return mysqli mysqli instance
     */
    public function getConnection()
    {
        return $this->conn;
    }

    /**
     * get name of current active database
     * @return string name
     */
    public function getDatabaseName(){
        return $this->dbname;
    }
}
