<?php
function insertToTransaction(){
 require_once('functions.php');
 set_exception_handler('error_handler');
 require_once('db_connection.php');
 $body = getBodyData();
 $milliseconds = round(microtime(true) * 1000);
 $userId = $body['user_id'];
 $busNum = $body['bus_id'];
 $text = $body['text'];
 $method = $body['type'];
 $query = "INSERT INTO `transaction` (`user_id`, `round_id`, `date`, `type`, `comment`)
  VALUES ('$userId', '$busNum', '$milliseconds', '$method', '$text')";
 $result = mysqli_query($conn, $query);
 if (mysqli_affected_rows($conn) === 0){
  throw new Exception('0 rows affected' . mysqli_error($conn));
 }
}
insertToTransaction();
?>
