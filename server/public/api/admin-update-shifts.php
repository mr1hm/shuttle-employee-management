<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$user_id = $data['user_id'];
$rounds = $data['rounds'];

for ($rounds_index = 0; $rounds_index < count($rounds); $rounds_index++){
  $current_round = (int)$rounds[$rounds_index];
  $rounds_string .= "$current_round";
  if($rounds_index < count($rounds) - 1){
    $rounds_string .= ", ";
  }
}
$query = "UPDATE `round`
            SET `user_id` = $user_id, `status` = 'scheduled'
            WHERE `id` IN ($rounds_string)";

$result = mysqli_query($conn, $query);
if(!$result){
  throw new Exception('mysql error: '.mysqli_error($conn));
}

?>
