<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(DATES);
set_tz_la();

$errors = [];

if (!array_key_exists('date', $_GET)){
  $errors[] = 'Date is required';
} else {
  $date = getFormattedDate($_GET['date']);
  if ($date === FALSE){
    $errors[] = 'Date is invalid';
  }
}

if (!array_key_exists('start_time', $_GET)){
  $errors[] = 'Start time is required';
} else {
  $start_time = $_GET['start_time'];
}

if (!array_key_exists('end_time', $_GET)){
  $errors[] = 'End time is required';
} else {
  $end_time = $_GET['end_time'];
}

if (count($errors) > 0){
  throw new ApiError(['errors' => $errors], 422);
}

$query = "SELECT `id` AS `user_id`, `first_name`, `last_name` FROM `user`
          WHERE `id` NOT IN
          (
              SELECT `user_id` FROM `round`
              WHERE `date` = ?
              AND `start_time` <= ?
              AND `end_time` >= ?
           )";

$statement = $mysqli->prepare($query);
if ($statement == FALSE){
    throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('sss', $date, $end_time, $start_time)){
  throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
  throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result === FALSE) {
    throw new ApiError(null, 500, 'Error retrieving shift data');
}

$output = [];
while($row = mysqli_fetch_assoc($result)){
  $output[] = $row;
}

send($output);
