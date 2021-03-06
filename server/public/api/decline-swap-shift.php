<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$input = getBodyData();

$user_id = intval($input['user_id']);
$target_id = intval($input['target_id']);
$original_rounds = $input['original_rounds'];
$target_rounds = $input['target_rounds'];

mysqli_query($conn, "START TRANSACTION");

foreach ($original_rounds as $round) {
  $query = "UPDATE `transaction` SET `status` = 'declined' WHERE `target_round_id` = {$round['round_id']}";
  $result = mysqli_query($conn, $query);
}

if (!$result) {
  throw new Exception("Sql error" . mysqli_error($conn));
}
foreach($target_rounds as $round){
  $query = "UPDATE `transaction` SET `status` = 'declined' WHERE `round_id` = {$round['round_id']}";
  $result = mysqli_query($conn, $query);
}
if (!$result) {
  throw new Exception("Sql error" . mysqli_error($conn));
}

if (mysqli_affected_rows($conn) < 1) {
  throw new Exception("No rows affected");
}

mysqli_query($conn, "COMMIT");
