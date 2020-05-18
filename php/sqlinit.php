<?php

$server = "172.17.0.2";
$user = "mwit";
$password = "3MnDApF3bu6XDGOE";
$database = "mwitdb";

$mysqli = new mysqli($server, $user, $password, $database);
if ($mysqli->connect_errno) {
    echo "connecton failed... nr: " . $mysqli->connect_errno . " -- " . $mysqli->connect_error;
}
