<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$input = getBodyData();

$user_id = intval($input['user_id']);
$target_id = intval($input['target_id']);
$user_round = intval($input['user_round']);


mysqli_query($conn, "START TRANSACTION");

$query = "UPDATE `round` SET `user_id` = {$target_id} WHERE `id` = {$user_round}";
$result = mysqli_query($conn, $query);
$query = "UPDATE `transaction` SET `status` = 'accepted' WHERE `round_id` = $user_round";
$result = mysqli_query($conn, $query);
if (mysqli_affected_rows($conn) < 1) {
  throw new Exception("No rows affected");
}

mysqli_query($conn, "COMMIT");


?>
