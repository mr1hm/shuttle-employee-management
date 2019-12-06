<?php
session_start();
require_once(__DIR__.'/error_handler.php');
require_once(__DIR__.'/../config/db_connect.php');

define('LIB', __DIR__);
define('ENCRYPT', LIB.'/encrypt.php');
define('AUTH', LIB.'/auth.php');

function send($data, $status = 200) {
  http_response_code($status);
  header('Content-Type: application/json');
  echo json_encode($data);
}
