<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$input = getBodyData();

$user_id = intval($input['user_id']);
$target_id = intval($input['target_id']);
$user_round = $input['user_round'];


mysqli_query($conn, 'START TRANSACTION');

forEach($user_round as $round){
  $round = intval($round);
  $query = "UPDATE `round` SET `user_id` = {$target_id} WHERE `id` = {$round}";
  $result = mysqli_query($conn, $query);
  if (mysqli_affected_rows($conn) < 1) {
    mysqli_query($conn, "ROLLBACK");
    throw new Exception(mysqli_error($conn));
  }
}

mysqli_query($conn, "COMMIT");


?>
