<?php

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
require_once(DATES);
set_tz_la();

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null ,401, 'Not Authorized');
}

$startDate = getFirstDayOfCurrentMonth();
$endDate = getLastDayOfCurrentMonth();

if (isset($_GET['startDate'])) {
  $startDate = $_GET['startDate'];
}

if (!empty($_GET['endDate'])) {
  $endDate = $_GET['endDate'];
}

$statement = $mysqli->prepare("SELECT *
  FROM `round`
  WHERE `user_id`= ?
  AND (`date` >= ? AND `date` <= ?)
  AND (`status` = 'scheduled' OR `status` = 'posted')
  ORDER BY `date` ASC");
if ($statement == FALSE){
  throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('iss', $user['userId'], $startDate, $endDate)){
  throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
  throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result === FALSE) {
  throw new ApiError(null, 500, 'Error getting month schedule');
}

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

send($data);
