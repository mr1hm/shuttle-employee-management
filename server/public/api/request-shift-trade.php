<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$input = getBodyData();
$user_id = intval($input['user_id']);
$target_id = intval($input['target_id']);
$user_round = $input['user_round'];
$type = $input['type'];
$date = round(microtime(true) * 1000);

mysqli_query($conn, 'START TRANSACTION');

forEach($user_round as $round){
  $round = intval($round);
  $query = "INSERT INTO `transaction`
    (`user_id`, `round_id`, `target_user_id`, `date`, `type`, `comment`) VALUES
    ($user_id, $round, $target_id, $date, '$type', 'no')";
  $result = mysqli_query($conn, $query);
}

if (!$result) {
  throw new Exception("Sql error" . mysqli_error($conn));
}


if (mysqli_affected_rows($conn) < 1) {
  mysqli_query($conn, "ROLLBACK");
  throw new Exception(mysqli_error($conn));
}

mysqli_query($conn, "COMMIT");


?>
