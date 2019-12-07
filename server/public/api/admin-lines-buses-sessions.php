<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$bodyData = getBodyData();

if ($method === 'GET') { // get all lines/buses from all sessions.

  $query = "SELECT * FROM `session`";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }

  print(json_encode($data));

}

if ($method === 'POST' && (isset($bodyData['name']))) { // add a new session

  $name = $bodyData['name'];
  $startDateString = $bodyData['startDateString'];
  $endDateString = $bodyData['endDateString'];
  $holidays = $bodyData['holidays'];
  $minHoursReq = $bodyData['minHoursReq'];
  $notes = $bodyData['notes'];

  $query = "INSERT INTO `session` (`name`, `startDateString`, `endDateString`, `notes`, `holidays`, `minHoursReq`)
          VALUES ('$name', '$startDateString', '$endDateString', '$notes', '$holidays', '$minHoursReq')";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $query = "SELECT * FROM `session`";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }

  print(json_encode($data));

}

if ($method === 'POST' && (isset($bodyData['paste']))) { // copy/paste a session into a different session

  // print('is_array was true' . json_encode($bodyData));
  foreach ($bodyData['copiedSessionArr'] as $value) {
    $line_name = $value['line_name'];
    $sessionID = $value['sessionID'];
    $status = $value['status'];
    $roundDuration = $value['roundDuration'];
    $public = $value['public'];
    $regularService = $value['regularService'];
    $specialDriver = $value['specialDriver'] === 'True' ? 1 : 0;
    $query = "INSERT INTO `route` (`line_name`, `session_id`, `status`, `roundDuration`, `public`,
                    `regularService`, `specialDriver`)
                VALUES ('$line_name', '$sessionID', '$status', '$roundDuration', '$public', '$regularService', '$specialDriver')";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $copiedRouteID = mysqli_insert_id($conn);

    foreach ($value['activeBuses'] as $busData) {
      $busNumber = $busData['busNumber'];
      $startTime = $busData['startTime'];
      $rounds = $busData['rounds'];
      $endTime = $busData['endTime'];
      $daysActive = $busData['daysActive'];
      $idRoute = $copiedRouteID;
      $vehicleID = $busData['vehicleID'];
      $gap = $busData['gap'];
      $gapDuration = $busData['gapDuration'];
      $openingDuration = $busData['openingDuration'];
      $closingDuration = $busData['closingDuration'];
      $query = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `rounds`, `end_time`, `daysActive`, `route_id`, `vehicle_id`, `gap`, `gapDuration`, `opening_duration`, `closing_duration`)
                  VALUES ('$busNumber', '$startTime', '$rounds', '$endTime', '$daysActive', '$idRoute', '$vehicleID', '$gap', '$gapDuration', '$openingDuration', '$closingDuration')";
      $result = mysqli_query($conn, $query);

      if (!$result) {
        throw new Exception('mysql error ' . mysqli_error($conn));
      }
    }
  }

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
            bi.`vehicle_id`,
            rt.`public`,
            rt.`regularService`,
            rt.`specialDriver`,
            s.`id` AS sessionID,
            IF (rt.`specialDriver` = 1, 'True', 'False') AS specialDriver
            FROM `route` AS rt
            LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
            JOIN `session` AS s ON s.`id` = rt.`session_id`
            WHERE s.`id` = '$sessionID'
            ORDER BY line_name";
      $result = mysqli_query($conn, $query);

      if (!$result) {
        throw new Exception('mysql error ' . mysqli_error($conn));
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

  }

if ($method === 'POST' && (isset($bodyData['session_id']))) { // select data from a different session

  $sessionID = $bodyData['session_id'];
  $query = "SELECT
            bi.`id` AS 'busID',
            bi.`bus_number`,
            rt.`id` AS 'real_route_id',
            bi.`rounds`,
            rt.`roundDuration`,
            bi.`start_time`,
            bi.`end_time`,
            bg.`gapStartTimes`,
            bg.`gapDurations`,
            rt.`line_name`,
            rt.`status`,
            bi.`opening_duration`,
            bi.`closing_duration`,
            bi.`vehicle_id`,
            bd.`daysActive`,
            rt.`public`,
            rt.`regularService`,
            rt.`specialDriver`,
            s.`id` AS sessionID,
            IF (rt.`specialDriver` = 1, 'True', 'False') AS specialDriver
            FROM `route` AS rt
            LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
            LEFT JOIN `session` AS s ON s.`id` = rt.`session_id`
            LEFT JOIN (SELECT `bus_id`, GROUP_CONCAT(`gapStartTime`) AS gapStartTimes, GROUP_CONCAT(`gapDuration`) AS gapDurations FROM `busGaps` GROUP BY `bus_id`) AS bg ON bg.`bus_id` = bi.`id`
            LEFT JOIN (SELECT `bus_id`, GROUP_CONCAT(`daysActive`) AS daysActive FROM `busDaysActive` GROUP BY `bus_id`) AS bd ON bd.`bus_id` = bi.`id`
            WHERE s.`id` = '$sessionID'
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
      $busInfo['openingDuration'] = $row['opening_duration'];
      $busInfo['closingDuration'] = $row['closing_duration'];
      $busInfo['vehicleID'] = $row['vehicle_id'];
      if ($row['daysActive'] !== NULL) {
        $busInfo['daysActive'] = explode(',', $row['daysActive']);
      } else {
        $busInfo['daysActive'] = [];
      }
      if ($row['gapStartTimes'] !== NULL) {
        $busInfo['gapStartTimes'] = explode(',', $row['gapStartTimes']);
      } else {
        $busInfo['gapStartTimes'] = [];
      }
      if ($row['gapDurations'] !== NULL) {
        $busInfo['gapDurations'] = explode(',', $row['gapDurations']);
      } else {
        $busInfo['gapDurations'] = [];
      }
    }

    unset($row['busID']);
    unset($row['bus_number']);
    unset($row['start_time']);
    unset($row['rounds']);
    unset($row['end_time']);
    unset($row['daysActive']);
    unset($row['gapStartTime']);
    unset($row['gapDuration']);
    unset($row['opening_duration']);
    unset($row['closing_duration']);
    unset($row['vehicle_id']);
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

}

?>
