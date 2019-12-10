<?php
require_once('../../lib/startup.php');
require_once(AUTH);
require_once(DATES);

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

$stmt = $mysqli->prepare("SELECT *
  FROM `round`
  WHERE `user_id`= ?
  AND (`date` >= ? AND `date` <= ?)
  AND (`status` = 'scheduled' OR `status` = 'posted')
  ORDER BY `date` ASC");

$stmt->bind_param('iss', $user['userId'], $startDate, $endDate);
$stmt->execute();

$result = $stmt->get_result();

if (!$result) {
  throw new ApiError(null, 500, 'Error getting month schedule');
}

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

send($data);
