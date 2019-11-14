<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$query = "SELECT
            bi.`id` AS 'busID',
            bi.`bus_number`,
            bi.`gapDuration`,
            rt.`id` AS 'real_route_id',
            bi.`rounds`,
            rt.`roundDuration`,
            bi.`start_time`,
            bi.`end_time`,
            bi.`daysActive`,
            bi.`gap`,
            rt.`line_name`,
            rt.`status`,
            bi.`opening_duration`,
            bi.`closing_duration`,
            rt.`public`,
            rt.`regularService`,
            rt.`specialDriver`,
            s.`id` AS sessionID,
            IF (rt.`specialDriver` = 1, 'True', 'False') AS specialDriver
            FROM `route` AS rt
            LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
            JOIN `session` AS s ON s.`id` = rt.`session_id`
            ORDER BY line_name";
$result = mysqli_query($conn, $query);

if (!$result) {
  throw new Exception('mysql error' . mysqli_error($conn));
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $busInfo = NULL;
  $routeId = $row['real_route_id'];

  if ($row['bus_number'] !== NULL) {
    $busInfo = [];
    $busInfo['busID'] = $row['busID'];
    $busInfo['busNumber'] = $row['bus_number'];
    $busInfo['startTime'] = $row['start_time'];
    $busInfo['rounds'] = $row['rounds'];
    $busInfo['endTime'] = $row['end_time'];
    $busInfo['daysActive'] = $row['daysActive'];
    $busInfo['gap'] = $row['gap'];
    $busInfo['gapDuration'] = $row['gapDuration'];
    $busInfo['openingDuration'] = $row['opening_duration'];
    $busInfo['closingDuration'] = $row['closing_duration'];
  }

  unset($row['busID']);
  unset($row['bus_number']);
  unset($row['start_time']);
  unset($row['rounds']);
  unset($row['end_time']);
  unset($row['daysActive']);
  unset($row['gap']);
  unset($row['gapDuration']);
  unset($row['opening_duration']);
  unset($row['closing_duration']);
  if (!isset($data[$routeId])) {
    if (isset($busInfo)) {
      $row['activeBuses'] = [$busInfo];
    } else {
      $row['activeBuses'] = [];
    }
    $data[$routeId] = $row;
  } else if (isset($busInfo)) {
    $data[$routeId]['activeBuses'][] = $busInfo;
  }
}

$data = array_values($data);
print(json_encode($data));

?>
