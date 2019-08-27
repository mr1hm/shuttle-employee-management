<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'PATCH') { //make sure it's patch request
  $body = getBodyData();
  if (empty($body['status'])) { //make sure there is a status of the body
    throw new Exception('request body needs a status key');
  }
  if (empty($body['user_id'])) {
    throw new Exception('request body needs an id ');
  }
  $id = $body['user_id'];
  if (!is_numeric($id)) { //checking to make sure it is a number
    throw new Exception('id needs to be a number');
  }
  $status = $body['status']; //store the status in a variable
  $validStatuses = ['scheduled', 'traded', 'posted', 'unscheduled'];
  if (!in_array($status, $validStatuses)) { //needle, haystack (what you are looking for, where you are looking for it)
    throw new Exception('not a valid status');
  }
  $query = " UPDATE `round` SET `status` = ? WHERE `user_id` = ? ";
  $statement = mysqli_stmt_init($conn);
  mysqli_stmt_prepare($statement, $query);
  mysqli_stmt_bind_param($statement, 'si', $status, $id); //avoiding SQL injection (keeping our information safe)//'si' = string and integer
  mysqli_stmt_execute($statement);
  $affectedRows = mysqli_stmt_affected_rows($statement);
  if (!$affectedRows) {
    throw new Exception('this is already the status selected');
  }
  //if the affectedRows is 0 throw exception that this is an invalid id
  print($affectedRows);
} else {
  throw new Exception("cannot $method /api/driver-shift.php");
}
?>
