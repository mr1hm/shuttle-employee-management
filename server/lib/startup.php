<?php
session_start();
require_once(__DIR__.'/error_handler.php');
require_once(__DIR__.'/../config/db_connect.php');

define('LIB', __DIR__);
define('AUTH', LIB.'/auth.php');
define('DATES', LIB.'/dates.php');
define('ENCRYPT', LIB.'/encrypt.php');

function _createRequestBodyParser(){
  $bodyData = NULL;

  return function() use (&$bodyData) {
    if ($bodyData === NULL){
      if ($_SERVER['Content-Type'] === 'application/json'){
        $bodyData = json_decode(file_get_contents('php://input'), TRUE);
      } else {
        $bodyData = $_POST;
      }
    }
    return $bodyData;
  };
}

$_getRequestBody = _createRequestBodyParser();

function getRequestBody(){
  global $_getRequestBody;
  return $_getRequestBody();
}

function send($data, $status = 200) {
  http_response_code($status);
  header('Content-Type: application/json');
  echo json_encode($data);
}
