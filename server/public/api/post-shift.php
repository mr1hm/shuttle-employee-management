<?php

require_once("functions.php");
set_exception_handler('error_handler');
require_once("db_connection.php");

$data = getbodyData();
$checkedRounds = $data['checkedRounds'];
$userId = $data['userId'];
$date = $data["date"];
$type = $data['type'];
$comment = $data['comment'];


mysqli_query($conn, 'START TRANSACTION');
forEach($checkedRounds as $round){
  $query = "INSERT INTO `transaction` (`user_id`, `round_id`, `date`, `type`, `comment`)
    VALUES ($userId, $round, $date, '$type', '$comment')";
  $result = mysqli_query($conn, $query);
}

if (mysqli_affected_rows($conn) < 1) {
  mysqli_query($conn, 'ROLLBACK');
  throw new Exception('invalid query');
}

mysqli_query($conn, "COMMIT");

?>
