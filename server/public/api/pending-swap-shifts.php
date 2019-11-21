<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$input = getBodyData();

$user_id = intval($input['user_id']);
$target_id = intval($input['target_id']);
$original_rounds = $input['original_rounds'];
$target_rounds = $input['target_rounds'];
$date = round(microtime(true) * 1000);


mysqli_query($conn, "START TRANSACTION");

foreach ($original_rounds as $round) {
  $query = "UPDATE `transaction` SET `status` = 'accepted' WHERE `round_id` = {$round['round_id']}";
  $result = mysqli_query($conn, $query);
}
if (!$result) {
  throw new Exception("Sql error" . mysqli_error($conn));
}

foreach($target_rounds as $round ) {
  $query = "INSERT INTO `transaction`
    (`user_id`, `round_id`, `target_user_id`, `date`, `type`, `comment`, `status`) VALUES
    ($target_id, {$round['roundID']}, $user_id, $date, 'swap-confirm', 'no', 'pending')";
  $result = mysqli_query($conn, $query);
}
if(!$result) {
  throw new Exception("Sql error".mysqli_error($conn));
}

foreach ($original_rounds as $round ) {
  $query = "INSERT INTO `transaction`
    (`user_id`, `target_round_id`, `target_user_id`, `date`, `type`, `comment`, `status`) VALUES
    ($target_id,{$round['round_id']}, $user_id, $date, 'swap-confirm', 'no', 'pending')";
  $result = mysqli_query($conn, $query);
}
if (!$result) {
  throw new Exception("Sql error 2" . mysqli_error($conn));
}

// foreach($original_rounds as $round ){
//   $query = "UPDATE `transaction` SET `status` = 'pending' WHERE `round_id` = {$round['round_id']}";
//   $result = mysqli_query($conn, $query);
// }
// foreach($target_rounds as $round){
//   $query = "UPDATE `transaction` SET `status` = 'pending' WHERE `round_id` = {$round['roundID']}";
//   $result = mysqli_query($conn, $query);
// }


// $query = "UPDATE `round` SET `user_id` = {$target_id} WHERE `id` = {$user_round}";
// $result = mysqli_query($conn, $query);


if (mysqli_affected_rows($conn) < 1) {
  throw new Exception("No rows affected");
}

mysqli_query($conn, "COMMIT");
