<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$bodyData = getBodyData();

if ($method === 'GET'){

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
            -- IF (rt.`public` = 1, 'True', 'False') as public,
            IF (rt.`specialDriver` = 1, 'True', 'False') as specialDriver
            FROM `route` AS rt
            LEFT JOIN `bus_info` AS bi ON bi.`route_id` = rt.`id`
            JOIN `session` AS s ON s.`id` = rt.`session_id`
            -- WHERE  rt. `status` = 'inactive'
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

} else if ($method === 'POST' && (isset($bodyData['line_name']))) { // add a new line.

    $line_name = $bodyData['line_name'];
    $sessionID = $bodyData['session_id'];
    $status = $bodyData['status'];
    $roundDuration = $bodyData['roundDuration'];
    $public = $bodyData['public'];
    $regularService = $bodyData['regularService'];
    $specialDriver = $bodyData['specialDriver'];
    // if ($specialDriver = false) {
    //   $specialDriver = FALSE;
    // }
    $query = "INSERT INTO `route` (`line_name`, `session_id`, `status`, `roundDuration`, `public`, `regularService`, `specialDriver`)
              VALUES ('$line_name', '$sessionID', '$status', '$roundDuration', '$public', '$regularService', '$specialDriver')";
    //print('add a line' . $query);

} else if ($method === 'POST' && ($bodyData['route_id'])) { // add new bus
    $busNumber = $bodyData['bus_number'];
    $startTime = $bodyData['start_time'];
    $rounds = $bodyData['rounds'];
    $endTime = $bodyData['end_time'];
    $daysActive = $bodyData['daysActive'];
    $idRoute = $bodyData['route_id'];
    $vehicleID = $bodyData['vehicle_id'];
    $gap = $bodyData['gap'];
    $gapDuration = $bodyData['gapDuration'];
    $openingDuration = $bodyData['opening_duration'];
    $closingDuration = $bodyData['closing_duration'];
    $query = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `rounds`, `end_time`, `daysActive`, `route_id`, `vehicle_id`, `gap`, `gapDuration`, `opening_duration`, `closing_duration`)
              VALUES ('$busNumber', '$startTime', '$rounds', '$endTime', '$daysActive', '$idRoute', '$vehicleID', '$gap', '$gapDuration', '$openingDuration', '$closingDuration')";
    //print('add bus' . $query);

} else if ($method === 'POST' && (isset($bodyData['id']))) { // edit a bus

    $busID = $bodyData['id'];
    $busNumber = $bodyData['bus_number'];
    $idRoute = $bodyData['route_id'];
    $startTime = $bodyData['start_time'];
    $rounds = $bodyData['rounds'];
    $endTime = $bodyData['end_time'];
    $daysActive = $bodyData['daysActive'];
    $gap = $bodyData['gap'];
    $openingDuration = $bodyData['opening_duration'];
    $closingDuration = $bodyData['closing_duration'];
    $query = "UPDATE `bus_info`
                SET `bus_number` = '$busNumber', `start_time` = '$startTime', `rounds` = '$rounds', `end_time` = '$endTime', `daysActive` = '$daysActive', `gap` = '$gap',
                    `opening_duration` = '$openingDuration', `closing_duration` = '$closingDuration'
                WHERE `bus_info`.`id` = '$busID'";

} else if ($method === 'DELETE' && (isset($bodyData['id']))) {

    $busID = $bodyData['id'];
    $query = "DELETE FROM `bus_info` WHERE `id` = $busID";

} else if ($method === 'DELETE' && (isset($bodyData['routeID']))) {

    $lineID = $bodyData['routeID'];
    $query = "DELETE FROM `route` WHERE `id` = $lineID";
}

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

if($method === 'GET') {
  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $busInfo = NULL;
    $routeId = $row['real_route_id'];
    //var_dump($row['bus_number']);

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
      $busInfo['closingDuration'] = $row['closing_duration']; //I added the data
    }

    unset($row['busID']);
    unset($row['bus_number']); //so I don't need it here anymore
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
      $data[$routeId] = $row; // double check that $data[] is returning array.
    } else if (isset($busInfo)) {
      $data[$routeId]['activeBuses'][] = $busInfo;
    }
  }

  $data = array_values($data);
  print(json_encode($data));

} else if ($method === 'POST' && (isset($bodyData['line_name']))) { // add a new line

    // $lineName = $_POST['line_name'];
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

} else if ($method === 'POST' && ($bodyData['route_id'])) { // add a new bus

    $query = "SELECT * FROM `bus_info`";
    $result = mysqli_query($conn, $query);

    if (!$result) {
      throw new Exception('mysql error ' . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
      $data = $row;
    }

    print(json_encode($data));

} else if ($method === 'POST' && (isset($bodyData['id']))) { // edit a bus

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

} else if ($method === 'DELETE' && (isset($bodyData['id']))) { // delete bus

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

} else if ($method === 'DELETE' && (isset($bodyData['routeID']))) { // delete line

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
}


// ASK IF THIS HEADER IS REQUIRED FOR ANYTHING ELSE.
// if ($method === 'POST'){
//   header("Location: http://localhost:3000/admin-routes");
//   exit();
// }

?>
