<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$user_id = $data['user_id'];
$round_id = $data['round_id'];

//UPDATE round SET user_id = 1, status = 'unscheduled'
$query = "UPDATE `round`
            SET `user_id` = $user_id, `status` = 'scheduled'
            WHERE `id` = $round_id";

$result = mysqli_query($conn, $query);
if(!$result){
  throw new Exception('mysql error: '.mysqli_error($conn));
}


?>
