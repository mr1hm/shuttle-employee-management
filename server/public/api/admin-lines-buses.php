<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$bodyData = getBodyData();

if ($method === 'GET'){
  // require_once 'admin-lines-buses-get.php';

  // $query = "SELECT
  //           bi.`id` AS 'busID',
  //           bi.`bus_number`,
  //           rt.`id` AS 'real_route_id',
  //           bi.`rounds`,
  //           rt.`roundDuration`,
  //           bi.`start_time`,
  //           bi.`end_time`,
  //           bg.`gapStartTimes`,
  //           bg.`gapDurations`,
  //           -- busGapID,
  //           rt.`line_name`,
  //           rt.`status`,
  //           bi.`opening_duration`,
  //           bi.`closing_duration`,
  //           bi.`vehicle_id`,
  //           bd.`daysActive`,
  //           rt.`public`,
  //           rt.`regularService`,
  //           rt.`specialDriver`,
  //           s.`id` AS sessionID,
  //           IF (rt.`specialDriver` = 1, 'True', 'False') AS specialDriver
  //           FROM `route` AS rt
  //           LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
  //           LEFT JOIN `session` AS s ON s.`id` = rt.`session_id`
  //           LEFT JOIN (SELECT `bus_id`, GROUP_CONCAT(`gapStartTime`) AS gapStartTimes, GROUP_CONCAT(`gapDuration`) AS gapDurations FROM `busGaps` GROUP BY `bus_id`) AS bg ON bg.`bus_id` = bi.`id`
  //           LEFT JOIN (SELECT `bus_id`, GROUP_CONCAT(`daysActive`) AS daysActive FROM `busDaysActive` GROUP BY `bus_id`) AS bd ON bd.`bus_id` = bi.`id`
  //           ORDER BY line_name";

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
            ORDER BY line_name";

} else if ($method === 'POST' && (isset($bodyData['lineID']))) { // edit a line

    $lineID = $bodyData['lineID'];
    $sessionID = $bodyData['session_id'];
    $line_name = $bodyData['line_name'];
    $status = $bodyData['status'];
    $roundDuration = $bodyData['roundDuration'];
    $public = $bodyData['public'];
    $regularService = $bodyData['regularService'];
    $specialDriver = $bodyData['specialDriver'];
    $query = "UPDATE `route`
                SET `line_name` = '$line_name', `session_id` = '$sessionID', `status` = '$status', `roundDuration` = '$roundDuration', `public` = '$public',
                    `regularService` = '$regularService', `specialDriver` = '$specialDriver'
                WHERE `route`.`id` = '$lineID'";

} else if ($method === 'POST' && (isset($bodyData['line_name']))) {
  // require_once 'admin-lines-buses-add.php';

    $line_name = $bodyData['line_name'];
    $sessionID = $bodyData['session_id'];
    $status = $bodyData['status'];
    $roundDuration = $bodyData['roundDuration'];
    $public = $bodyData['public'];
    $regularService = $bodyData['regularService'];
    $specialDriver = $bodyData['specialDriver'];

    $query = "INSERT INTO `route` (`line_name`, `session_id`, `status`, `roundDuration`, `public`, `regularService`, `specialDriver`)
              VALUES ('$line_name', '$sessionID', '$status', '$roundDuration', '$public', '$regularService', '$specialDriver')";

} else if ($method === 'POST' && (isset($bodyData['paste']))) {

  require_once 'admin-lines-buses-sessions.php';

} else if ($method === 'POST' && (isset($bodyData['route_id']))) {
    require_once 'admin-lines-buses-add.php';

    // $busNumber = $bodyData['bus_number'];
    // $startTime = $bodyData['start_time'];
    // $rounds = $bodyData['rounds'];
    // $endTime = $bodyData['end_time'];
    // $daysActive = $bodyData['daysActive'];
    // $idRoute = $bodyData['route_id'];
    // $vehicleID = $bodyData['vehicle_id'];
    // $gap = $bodyData['gap'];
    // $gapDuration = $bodyData['gapDuration'];
    // $openingDuration = $bodyData['opening_duration'];
    // $closingDuration = $bodyData['closing_duration'];
    // $query = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `rounds`, `end_time`, `daysActive`, `route_id`, `vehicle_id`, `gap`, `gapDuration`, `opening_duration`, `closing_duration`)
    //           VALUES ('$busNumber', '$startTime', '$rounds', '$endTime', '$daysActive', '$idRoute', '$vehicleID', '$gap', '$gapDuration', '$openingDuration', '$closingDuration')";

} else if ($method === 'POST' && (isset($bodyData['id']))) {

    $busID = $bodyData['id'];
    $busNumber = $bodyData['bus_number'];
    $startTime = $bodyData['start_time'];
    $rounds = $bodyData['rounds'];
    $endTime = $bodyData['end_time'];
    $daysActive = $bodyData['daysActive'];
    // $gap = $bodyData['gap'];
    // $gapDuration = $bodyData['gapDuration'];
    $openingDuration = $bodyData['opening_duration'];
    $closingDuration = $bodyData['closing_duration'];
    $query = "UPDATE `bus_info`
                SET `bus_number` = '$busNumber', `start_time` = '$startTime', `rounds` = '$rounds', `end_time` = '$endTime', `opening_duration` = '$openingDuration', `closing_duration` = '$closingDuration'
                WHERE `bus_info`.`id` = '$busID'";

} else if ($method === 'DELETE' && (isset($bodyData['id']))) {

    $busID = $bodyData['id'];
    $query = "DELETE FROM `bus_info` WHERE `id` = $busID";

    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error bus_info table ' . mysqli_error($conn));
    }

    $query = "DELETE FROM `busGaps` WHERE `bus_id` = $busID";

    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error busGaps table ' . mysqli_error($conn));
    }

    $query = "DELETE FROM `busDaysActive` WHERE `bus_id` = $busID";

    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error busDaysActive table ' . mysqli_error($conn));
    }

} else if ($method === 'DELETE' && (isset($bodyData['routeID']))) { // deletes line and buses that were on that line

    $lineID = $bodyData['routeID'];
    foreach($bodyData['buses'] as $value) {
      $busID = $value;


      $query = "DELETE FROM `bus_info` WHERE `id` = $busID";
      $result = mysqli_query($conn, $query);
      if (!$result) {
        throw new Exception('mysql error ' . mysqli_error($conn));
      }
    }

    $query = "DELETE FROM `route` WHERE `id` = $lineID";

} else if ($method === 'POST' && (isset($bodyData['session_id']))) { // select data from a different session

  require_once 'admin-lines-buses-sessions.php';

} else if ($method === 'POST' && (isset($bodyData['rounds']))) { // PROBABLY DONT NEED THIS ANYMORE
    $date = date('Y-m-d');
    $query = "SELECT rd.`id` AS roundID,
                     rd.`user_id` AS userID,
                     rd.`session_id`,
                     rd.`bus_info_id` AS busID,
                     rd.`date`,
                     CONCAT(rd.`start_time`, ',', rd.`end_time`) AS shifts,
                     rd.`status`,
                     u.`first_name`,
                     u.`last_name`,
                     u.`nickname`,
                     u.`role`,
                     u.`special_route_ok`,
                     bi.`route_id`,
                     bi.`vehicle_id`,
                     bi.`bus_number`,
                     r.`line_name`
              FROM `round` AS rd
              LEFT JOIN `user` AS u ON u.`id` = rd.`user_id`
              LEFT JOIN (SELECT `id`, `route_id`, `vehicle_id`, `bus_number` FROM `bus_info`) AS bi ON bi.`id` = rd.`bus_info_id`
              LEFT JOIN (SELECT `id`, `line_name` FROM `route`) AS r ON r.`id` = bi.`route_id`
              WHERE rd.`date` = '$date'
              ORDER BY rd.`start_time` ASC";

    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      if ($row['shifts'] !== NULL) {
        $row['shifts'] = explode(',', $row['shifts']);
      }
      $data[] = $row;
    }

    print(json_encode($data));

  } else if ($method === 'POST' && (isset($bodyData['date']))) {

    $date = $bodyData['date'];
    $query = "SELECT rd.`id` AS roundID,
                     rd.`user_id` AS userID,
                     rd.`session_id`,
                     rd.`bus_info_id` AS busID,
                     rd.`date`,
                     rd.`start_time`,
                     rd.`end_time`,
                     rd.`status`,
                     u.`first_name`,
                     u.`last_name`,
                     u.`nickname`,
                     u.`role`,
                     u.`special_route_ok`,
                     bi.`route_id`,
                     bi.`vehicle_id`,
                     bi.`bus_number`,
                     r.`line_name`
              FROM `round` AS rd
              LEFT JOIN `user` AS u ON u.`id` = rd.`user_id`
              LEFT JOIN (SELECT `id`, `route_id`, `vehicle_id`, `bus_number` FROM `bus_info`) AS bi ON bi.`id` = rd.`bus_info_id`
              LEFT JOIN (SELECT `id`, `line_name` FROM `route`) AS r ON r.`id` = bi.`route_id`
              WHERE rd.`date` = '$date'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $data = [];
    $busID = NULL;
    $userID = NULL;
    $routeID = NULL;
    while ($row = mysqli_fetch_assoc($result)) {
      if ($row['route_id'] !== NULL) {
        if ($routeID !== $row['route_id']) {
        $routeID = $row['route_id'];
        $shift = [];
        $shift['start'] = $row['start_time'];
        $shift['end'] = $row['end_time'];
        $shift['userID'] = $row['userID'];
        if (!empty($row['nickname'])) {
            $shift['name'] = "{$row['first_name']} '{$row['nickname']}' {$row['last_name']}";
            unset($row['nickname']);
          }
          $shift['name'] = "{$row['first_name']} {$row['last_name']}";
          $shift['role'] = $row['role'];
          unset($row['start_time']);
          unset($row['end_time']);
          unset($row['userID']);
          unset($row['first_name']);
          unset($row['last_name']);
          unset($row['role']);
          $row['shifts'][] = $shift;
          $data[] = $row;
        } else if ($routeID === $row['route_id']) {
          $lastInsertedRow = count($data) - 1;
          $shift = [];
          $shift['start'] = $row['start_time'];
          $shift['end'] = $row['end_time'];
          $shift['userID'] = $row['userID'];
          $shift['name'] = "{$row['first_name']} {$row['last_name']}";
          $shift['role'] = $row['role'];
          unset($row['start_time']);
          unset($row['end_time']);
          unset($row['userID']);
          unset($row['first_name']);
          unset($row['last_name']);
          unset($row['role']);
          $data[$lastInsertedRow]['shifts'][] = $shift;
        }
      }
    }

    print(json_encode($data));
    exit;

} else if ($method === 'POST' && (isset($bodyData['masterSchedule']))) {
    $date = $bodyData['masterSchedule'];
    $query = "SELECT rd.`id` AS roundID,
                     rd.`user_id` AS userID,
                     rd.`session_id`,
                     rd.`bus_info_id` AS busID,
                     rd.`date`,
                     rd.`start_time`,
                     rd.`end_time`,
                     rd.`status`,
                     u.`first_name`,
                     u.`last_name`,
                     u.`nickname`,
                     u.`role`,
                     u.`special_route_ok`,
                     bi.`route_id`,
                     bi.`vehicle_id`,
                     bi.`bus_number`,
                     r.`line_name`
              FROM `round` AS rd
              LEFT JOIN `user` AS u ON u.`id` = rd.`user_id`
              LEFT JOIN (SELECT `id`, `route_id`, `vehicle_id`, `bus_number` FROM `bus_info`) AS bi ON bi.`id` = rd.`bus_info_id`
              LEFT JOIN (SELECT `id`, `line_name` FROM `route`) AS r ON r.`id` = bi.`route_id`
              WHERE rd.`date` = '$date'";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $data = [];
    $busID = NULL;
    $userID = NULL;
    $routeID = NULL;
    while ($row = mysqli_fetch_assoc($result)) {
      if ($row['route_id'] !== NULL) {
        if ($routeID !== $row['route_id']) {
        $routeID = $row['route_id'];
        $shift = [];
        $shift['start'] = $row['start_time'];
        $shift['end'] = $row['end_time'];
        $shift['userID'] = $row['userID'];
        if (!empty($row['nickname'])) {
            $shift['name'] = "{$row['first_name']} '{$row['nickname']}' {$row['last_name']}";
            unset($row['nickname']);
          }
          $shift['name'] = "{$row['first_name']} {$row['last_name']}";
          $shift['role'] = $row['role'];
          unset($row['start_time']);
          unset($row['end_time']);
          unset($row['userID']);
          unset($row['first_name']);
          unset($row['last_name']);
          unset($row['role']);
          $row['shifts'][] = $shift;
          $data[] = $row;
        } else if ($routeID === $row['route_id']) {
          $lastInsertedRow = count($data) - 1;
          $shift = [];
          $shift['start'] = $row['start_time'];
          $shift['end'] = $row['end_time'];
          $shift['userID'] = $row['userID'];
          $shift['name'] = "{$row['first_name']} {$row['last_name']}";
          $shift['role'] = $row['role'];
          unset($row['start_time']);
          unset($row['end_time']);
          unset($row['userID']);
          unset($row['first_name']);
          unset($row['last_name']);
          unset($row['role']);
          $data[$lastInsertedRow]['shifts'][] = $shift;
        }
      }
      // if ($busID !== $row['busID'] && $userID !== $row['userID']) {
      //   $busID = $row['busID'];
      //   $userID = $row['userID'];
      //   $shift = [];
      //   $shift['start'] = $row['start_time'];
      //   $shift['end'] = $row['end_time'];
      //   unset($row['start_time']);
      //   unset($row['end_time']);
      //   $row['shifts'][] = $shift;
      //   $data[] = $row;
      // } else if ($busID === $row['busID'] && $userID === $row['userID']) {
      //   $lastRow = count($data) - 1;
      //   $shift = [];
      //   $shift['start'] = $row['start_time'];
      //   $shift['end'] = $row['end_time'];
      //   $data[$lastRow]['shifts'][] = $shift;
      // }
    }

    print(json_encode($data));
} else if ($method === 'DELETE' && isset($bodyData['busGapID'])) {

  $busGapID = $bodyData['busGapID'];

  $query = "DELETE FROM `busGaps` WHERE `busGaps`.`id` = $busGapID";
  $result = mysqli_query($conn, $query);

  if (!$result){
    throw new Exception('delete busGapID query error ' . mysqli_error($conn));
  }

  $deletedGapID = [];
  $deletedGapID['busGapID'] = $busGapID;

  print(json_encode($deletedGapID));
  exit;

} else if ($method === 'POST' && isset($bodyData['newGap'])) {

  $busID = $bodyData['busID'];
  $gapStartTime = $bodyData['gapStartTime'];
  $gapDuration = $bodyData['gapDuration'];

  $query = "INSERT INTO `busGaps` (`bus_id`, `gapStartTime`, `gapDuration`)
            VALUES ('$busID', '$gapStartTime', '$gapDuration')";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('add new gap query error ' . mysqli_error($conn));
  }

  print(json_encode($bodyData['newGap']));
  exit;
}

$result = mysqli_query($conn, $query);

if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

if($method === 'GET') {
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
  // while ($row = mysqli_fetch_assoc($result)) {
  //   $busInfo = NULL;
  //   $routeId = $row['real_route_id'];

  //   if ($row['bus_number'] !== NULL) {
  //     $busInfo = [];
  //     if (isset($busInfo['busID'])) {

  //     }
  //     $busInfo['busID'] = $row['busID'];
  //     $busInfo['busNumber'] = $row['bus_number'];
  //     $busInfo['startTime'] = $row['start_time'];
  //     $busInfo['rounds'] = $row['rounds'];
  //     $busInfo['endTime'] = $row['end_time'];
  //     // $busInfo['daysActive'] = $row['daysActive'];
  //     // $busInfo['gapDuration'] = $row['gapDuration'];
  //     $busInfo['openingDuration'] = $row['opening_duration'];
  //     $busInfo['closingDuration'] = $row['closing_duration'];
  //     $busInfo['vehicleID'] = $row['vehicle_id'];
  //     if ($row['daysActive'] !== NULL) {
  //       $busInfo['daysActive'] = explode(',', $row['daysActive']);
  //     } else {
  //       $busInfo['daysActive'] = [];
  //     }
  //     if ($row['gapStartTimes'] !== NULL) {
  //       $busInfo['gapStartTimes'] = explode(',', $row['gapStartTimes']);
  //     } else {
  //       $busInfo['gapStartTimes'] = [];
  //     }
  //     if ($row['gapDurations'] !== NULL) {
  //       $busInfo['gapDurations'] = explode(',', $row['gapDurations']);
  //     } else {
  //       $busInfo['gapDurations'] = [];
  //     }
  //   }

    // unset($row['busID']);
    // unset($row['bus_number']);
    // unset($row['start_time']);
    // unset($row['rounds']);
    // unset($row['end_time']);
    // unset($row['daysActive']);
    // unset($row['gapStartTime']);
    // unset($row['gapDuration']);
    // unset($row['gapStartTimes']);
    // unset($row['gapDurations']);
    // unset($row['opening_duration']);
    // unset($row['closing_duration']);
    // unset($row['vehicle_id']);
  //   if (!isset($data[$routeId])) {
  //     if (isset($busInfo)) {
  //       $row['activeBuses'] = [$busInfo];
  //     } else {
  //       $row['activeBuses'] = [];
  //     }
  //     $data[$routeId] = $row;
  //   } else if (isset($busInfo)) {
  //     $data[$routeId]['activeBuses'][] = $busInfo;
  //   }
  // }

  // while ($row = mysqli_fetch_assoc($result)) {
  //   $data[] = $row;
  // }
  // $data = array_values($data);
  // $data = array_values($data);
  // foreach($data[$routeID] as $activeBuses){
  //   $activeBuses['activeBuses'] = array_values($activeBuses['activeBuses']);
  // }
  // $data[$routeID]['activeBuses'] = array_values($data[$routeID]['activeBuses']);
  foreach($data as &$route){
    $route['activeBuses'] = array_values($route['activeBuses']);
  }
  $data = array_values($data);
  print(json_encode($data));

}

if ($method === 'POST' && (isset($bodyData['line_name']))) {

    $query = "SELECT * FROM `route`";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $data = $row;
    }

    print(json_encode($data));

} else if ($method === 'POST' && (isset($bodyData['id']))) {

    $new_id = $bodyData['id'];
    $query = "SELECT * FROM `bus_info` WHERE `id` = '$new_id'";

    $result = mysqli_query($conn, $query);
    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $data = $row;
    }

    print(json_encode($data));

} else if ($method === 'DELETE' && (isset($bodyData['id']))) {

    $deletedBus = $bodyData['id'];
    $query = "SELECT * FROM `bus_info`";

    $result = mysqli_query($conn, $query);
    if (!$result) {
      throw new Exception('mysql error' . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $data = $row;
    }

    print(json_encode($data));

} else if ($method === 'DELETE' && (isset($bodyData['routeID']))) {

    $query = "SELECT * FROM `route`";

    $result = mysqli_query($conn, $query);
    if (!$result) {
      throw new Exception('mysql error' . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $data = $row;
    }

    print(json_encode($data));

} else if ($method === 'DELETE' && (isset($bodyData['busID']))) {

  $busGapID = $bodyData['busGapID'];
  $query = "DELETE FROM `busGaps` WHERE `busGaps`.`id` = '$busGapID'";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('delete bus gaps query error ' . mysqli_error($conn));
  }
}

?>
