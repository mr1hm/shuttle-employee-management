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
  // $minHoursReq = $bodyData['minHoursReq'];
  $notes = $bodyData['notes'];

  $query = "INSERT INTO `session` (`name`, `startDateString`, `endDateString`, `notes`, `holidays`)
          VALUES ('$name', '$startDateString', '$endDateString', '$notes', '$holidays')";
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
            busGapID,
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
            LEFT JOIN (SELECT GROUP_CONCAT(`id`) AS busGapID, `bus_id`, GROUP_CONCAT(`gapStartTime`) AS gapStartTimes, GROUP_CONCAT(`gapDuration`) AS gapDurations FROM `busGaps` GROUP BY `id`, `bus_id`) AS bg ON bg.`bus_id` = bi.`id`
            LEFT JOIN (SELECT `bus_id`, GROUP_CONCAT(`daysActive`) AS daysActive FROM `busDaysActive` GROUP BY `bus_id`) AS bd ON bd.`bus_id` = bi.`id`
            WHERE s.`id` = '$sessionID'
            ORDER BY line_name";

  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }

  $data = [];
  $busInfo = NULL;
  $busID = NULL;
  while ($row = mysqli_fetch_assoc($result)) {
    $routeID = $row['real_route_id'];
    $busID = $row['busID'];
    if (!array_key_exists($routeID, $data)){
      $data[$routeID]['real_route_id'] = $row['real_route_id'];
      $data[$routeID]['roundDuration'] = $row['roundDuration'];
      $data[$routeID]['line_name'] = $row['line_name'];
      $data[$routeID]['status'] = $row['status'];
      $data[$routeID]['public'] = $row['public'];
      $data[$routeID]['regularService'] = $row['regularService'];
      $data[$routeID]['specialDriver'] = $row['specialDriver'];
      $data[$routeID]['sessionID'] = $row['sessionID'];
      $data[$routeID]['activeBuses'] = [];
    }
    if ($row['busID'] !== NULL && !array_key_exists($busID, $data[$routeID]['activeBuses'])) {
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
        $busInfo['gapInfo'] = [];
        $data[$routeID]['activeBuses'][$busID] =$busInfo;
      }
    if ($row['busGapID'] !== NULL && !empty($busID)) {
      $gapInfo = [];
      $gapInfo['busGapID'] = $row['busGapID'];
      $gapInfo['gapStartTime'] = $row['gapStartTimes'];
      $gapInfo['gapDuration'] = $row['gapDurations'];

      $foundGapID = FALSE;
      foreach ($data[$routeID]['activeBuses'][$busID]['gapInfo'] as $value){
        if ($value['busGapID'] == $gapInfo['busGapID']){
          $foundGapID = TRUE;
          break;
        }
      }
      if (!$foundGapID){
        $data[$routeID]['activeBuses'][$busID]['gapInfo'][] = $gapInfo;
      }
    }
  }

  foreach($data as &$route){
    $route['activeBuses'] = array_values($route['activeBuses']);
  }
  $data = array_values($data);
  print(json_encode($data));

}

if ($method === 'POST' && (isset($bodyData['sessionInfo']))) {

  $sessionID = $bodyData['sessionInfo'];

  $query = "SELECT
              bi.`id` AS 'busID',
              rt.`line_name`,
              rt.`id` AS routeID,
              s.`name` AS sessionName,
              s.`notes` AS sessionNotes,
              s.`holidays` AS sessionHolidays,
              s.`startDateString` AS sessionStart,
              s.`endDateString` AS sessionEnd,
              s.`min_operator_hours`,
              s.`min_operations_hours`,
              s.`min_trainer_hours`,
              s.`min_trainee_hours`,
              s.`id` AS sessionID,
              IF (rt.`specialDriver` = 1, 'True', 'False') AS specialDriver
              FROM `route` AS rt
              LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
              LEFT JOIN `session` AS s ON s.`id` = rt.`session_id`
              WHERE s.`id` = '$sessionID'
              ORDER BY rt.`id`";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('query error ' . mysqli_error($conn));
  }

  $data = [];
  $sessionInfo = [];
  $routeID = NULL;
  while ($row = mysqli_fetch_assoc($result)) {
    if ($routeID !== $row['routeID']) {
      $buses = NULL;
      $routeID = $row['routeID'];
      $sessionInfo['sessionName'] = $row['sessionName'];
      $sessionInfo['sessionNotes'] = $row['sessionNotes'];
      $sessionInfo['sessionHolidays'] = $row['sessionHolidays'];
      $sessionInfo['sessionStart'] = $row['sessionStart'];
      $sessionInfo['sessionEnd'] = $row['sessionEnd'];
      $sessionInfo['minHoursReq'] = $row['minHoursReq'];
      $sessionInfo['sessionID'] = $row['sessionID'];
      $sessionInfo['lineName'] = $row['line_name'];
      $sessionInfo['routeID'] = $row['routeID'];
      $sessionInfo['min_operator_hours'] = $row['min_operator_hours'];
      $sessionInfo['min_operations_hours'] = $row['min_operations_hours'];
      $sessionInfo['min_trainer_hours'] = $row['min_trainer_hours'];
      $sessionInfo['min_trainee_hours'] = $row['min_trainee_hours'];
      if ($row['busID'] !== NULL) {
        $buses[] = $row['busID'];
      } else {
        $buses = [];
      }
      $sessionInfo['activeBuses'] = $buses;
      unset($row['sessionName']);
      unset($row['sessionNotes']);
      unset($row['sessionHolidays']);
      unset($row['sessionStart']);
      unset($row['sessionEnd']);
      unset($row['minHoursReq']);
      unset($row['busID']);
      unset($row['line_name']);
      unset($row['routeID']);
      unset($row['specialDriver']);
      unset($row['sessionID']);
      $data[$routeID] = $sessionInfo;
    } else if ($routeID === $row['routeID'] && $row['busID'] !== NULL) {
      $buses[] = $row['busID'];
      $data[$routeID]['activeBuses'] = $buses;
    }
  }
  $data[$routeID] = $sessionInfo;
  $data = array_values($data);

  if (!isset($routeID)) {
    // $data = $sessionInfo;
    $data = [];
  }

  print(json_encode($data));
}

if ($method === 'DELETE' && isset($bodyData['sessionToDelete'])) {

  $routeIDArr = $bodyData['routeIDArr'];
  $busIDArr = $bodyData['busIDArr'];
  $sessionID = $bodyData['sessionToDelete'];

  $query = "DELETE FROM `session` WHERE `session`.`id` = '$sessionID'";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('delete session query error ' . mysqli_error($conn));
  }

  $query = "DELETE FROM `round` WHERE `round`.`session_id` = '$sessionID'";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('delete session rounds query error ' . mysqli_error($conn));
  }

  $query = "DELETE FROM `route` WHERE `route`.`session_id` = '$sessionID'";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('delete session lines query error ' . mysqli_error($conn));
  }

  foreach($routeIDArr as $value) {

    $query = "DELETE FROM `bus_info` WHERE `bus_info`.`route_id` = '$value'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('delete from bus_info query error ' . mysqli_error($conn));
    }
  }

  foreach($busIDArr as $busID) {

    $query = "DELETE FROM `busGaps` WHERE `busGaps`.`bus_id` = '$busID'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('delete session - delete from busGaps table error ' . mysqli_error($conn));
    }

    $query = "DELETE FROM `busDaysActive` WHERE `busDaysActive`.`bus_id` = '$busID'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('delete session - delete from busDaysActive table error ' . mysqli_error($conn));
    }

  }

  // doesn't delete existing bus gaps or bus daysActive

}

?>
