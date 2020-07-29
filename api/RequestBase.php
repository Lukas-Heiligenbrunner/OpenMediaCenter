<?php
require 'Database.php';

abstract class RequestBase {
    private array $actions = array();
    protected mysqli $conn;

    abstract function initIdentifiers();

    function addIdentifier($action, $callback) {
        $this->actions[$action] = $callback;
    }

    function handleAction() {
        $this->conn = Database::getInstance()->getConnection();

        if (isset($_POST['action'])) {
            $this->initIdentifiers();

            $action = $_POST['action'];
            call_user_func($this->actions[$action]);
        }
    }
}
