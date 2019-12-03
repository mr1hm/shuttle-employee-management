<?php
session_start();
require_once('error_handler.php');
require_once('db_connect.php');

function send($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
}
