<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$id = $_GET['id'];

if(!$id){
  throw new Exception("Invalid user ID");
}

$query = "SELECT t.`id`, t.`user_id`, t.`target_user_id`, t.`date` as request_date, t.`type`, t.`comment`, t.`status`,
          r.`user_id`, r.`date` as shift_date, r.`start_time`, r.`end_time`, r.`bus_info_id`
          FROM `transaction` as t
          JOIN `round` as r
          ON  t.`round_id` = r.`id`
          WHERE `target_user_id` = $id";

$result = mysqli_query($conn, $query);
$output = [];

while($row = mysqli_fetch_assoc($result)){
  $output[] = $row;
}

print_r(json_encode($output));

?>