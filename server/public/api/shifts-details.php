<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

if (!empty($_GET['user_id'])) {
  $userID = intval($_GET['user_id']);
} else throw new Exception('need id for query');

if (!empty($_GET['unixdate'])) {
  $unixDate = intval($_GET['unixdate']);
} else throw new Exception('need unix date of the shift for query');

if (!empty($_GET['start_time'])) {
  $shiftStartTime = intval($_GET['start_time']);
} else throw new Exception('need the shift block start time for query');

if (!empty($_GET['end_time'])) {
  $shiftEndTime = intval($_GET['end_time']);
} else throw new Exception('need the shift block end time for query');

$query = "SELECT * FROM `round` WHERE `user_id` = {$userID}
  AND `date` = {$unixDate}
  AND (`start_time` >= {$shiftStartTime} AND `end_time` <= {$shiftEndTime})
  AND `status` = 'scheduled'
  ORDER BY `start_time` ASC";

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode($data));
?>
