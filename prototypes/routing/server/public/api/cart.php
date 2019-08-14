<?php

header('Content-Type: application/json');

define('INTERNAL', true);

require('functions.php');

require_once('db_connection.php');

session_start();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'POST':  
    require('cart_add.php');
    break;
  case 'GET':
    require('cart_get.php');
    break;
}

?>




