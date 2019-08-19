<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

// $output = file_get_contents('dummy-data-assign-shifts.json');
// print($output);

if(!empty($_GET['unix_timestamp'])){
  $timestamp = $_GET['unix_timestamp'];
  if (!is_numeric($timestamp)) {
    throw new Exception('This is not a unix timestamp. Please enter a valid unix_timestamp');
  };
  $timestamp = intval($timestamp);
}

//create query
//$query=

$result = mysqli_query($conn, $query);

if(!$result){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$data = [];

//generate output

print(json_encode($data));
?>