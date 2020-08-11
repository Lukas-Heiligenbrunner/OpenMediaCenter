<?php
require_once 'src/Database.php';

abstract class RequestBase {
    protected mysqli $conn;
    private array $actions = array();

    /**
     * adds a new action handler to the current api file
     *
     * @param $action string name of the action variable
     * @param $callback Closure callback function to be called
     */
    function addActionHandler($action, $callback) {
        $this->actions[$action] = $callback;
    }

    /**
     * runs the correct handler
     * should be called once within the api request
     */
    function handleAction() {
        $this->conn = Database::getInstance()->getConnection();

        if (isset($_POST['action'])) {
            $this->initHandlers();

            $action = $_POST['action'];

            // call the right handler
            $this->actions[$action]();
        } else {
            echo('{data:"error"}');
        }
    }

    /**
     * Send response message and exit script
     * @param $message string the response message
     */
    function commitMessage($message){
        echo $message;
        exit(0);
    }

    /**
     * add the action handlers in this abstract method
     */
    abstract function initHandlers();
}