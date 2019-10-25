<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$body = getBodyData();
$id = $body['id'];

if(!$id){
  print($id);
  throw new Exception("Invalid round ID");
}

$query = "UPDATE `transaction` SET `status` = 'declined' WHERE `round_id`=$id";

$result = mysqli_query($conn, $query);

if(mysqli_affected_rows($conn) < 1){
  throw new Exception('table unaffected');
}

?>
