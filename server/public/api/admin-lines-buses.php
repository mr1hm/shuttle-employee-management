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
              rt.`id` AS 'real_route_id',
              bi.`start_time`,
              bi.`end_time`,
              bi.`daysActive`,
              bi.`gap`,
              rt.`line_name`,
              rt.`status`,
              bi.`opening_duration`,
              bi.`closing_duration`,
              rt.`public`,
              rt.`regularService`
              -- IF (rt.`public` = 1, 'True', 'False') as public,
              -- IF (rt.`regularService` = 1, 'True', 'False') as regularService
              FROM
              `route` AS rt
              LEFT JOIN
              `bus_info` AS bi
              ON
              bi.`route_id` = rt.`id`
            -- WHERE  rt. `status` = 'inactive'
            ORDER BY line_name";


} else if ($method === 'POST' && (isset($_POST['line_name']))) { // change condition to better fit add bus method.

    $line_name = $_POST['line_name'];
    $status = $_POST['active'];
    $public = $_POST['public'];
    $regularService = $_POST['regular_service'];
    $query = "INSERT INTO `route` (`status`, `line_name`, `opening_duration`, `closing_duration`, `public`, `regularService`)
              VALUES ('$status', '$line_name', '$public', '$regularService')";
    //print('add a line' . $query);

} else if ($method === 'POST' && (isset($_POST['route_id']))) {
  $busNumber = $_POST['bus_number'];
  $startTime = $_POST['start_time'];
  $endTime = $_POST['end_time'];
  $daysActive = $_POST['daysActive'];
  $idRoute = $_POST['route_id'];
  $vehicleID = 1;
  $gap = $_POST['gap'];
  $openingDuration = $_POST['opening_duration'];
  $closingDuration = $_POST['closing_duration'];
  $query = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `end_time`, `daysActive`, `route_id`, `vehicle_id`, `gap`, `opening_duration`, `closing_duration`)
            VALUES ('$busNumber', '$startTime', '$endTime', '$daysActive', '$idRoute', '$vehicleID', '$gap', '$openingDuration', '$closingDuration')";
  //print('add bus' . $query);

} else if ($method === 'POST' && ($bodyData['id'])) {
  //echo 'this is a POST EDIT request';
  // echo $_SESSION['busID'];
  $busID = $bodyData['id'];
  //echo $busID;
  $busNumber = $bodyData['bus_number'];
  $startTime = $bodyData['start_time'];
  $endTime = $bodyData['end_time'];
  $daysActive = $bodyData['daysActive'];
  $gap = $bodyData['gap'];
  $openingDuration = $bodyData['opening_duration'];
  $closingDuration = $bodyData['closing_duration'];
  $query = "UPDATE `bus_info`
              SET `bus_number` = '$busNumber', `start_time` = '$startTime', `end_time` = '$endTime', `daysActive` = '$daysActive', `gap` = '$gap',
                  `opening_duration` = '$openingDuration', `closing_duration` = '$closingDuration'
              WHERE `bus_info`.`id` = '$busID'";
  //print($query);
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
      $busInfo['endTime'] = $row['end_time'];
      $busInfo['daysActive'] = $row['daysActive'];
      $busInfo['gap'] = $row['gap'];
      $busInfo['openingDuration'] = $row['opening_duration'];
      $busInfo['closingDuration'] = $row['closing_duration']; //I added the data
    }

    unset($row['busID']);
    unset($row['bus_number']); //so I don't need it here anymore
    unset($row['start_time']);
    unset($row['end_time']);
    unset($row['daysActive']);
    unset($row['gap']);
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
} else if ($method === 'POST' && ($bodyData['id'])) {

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

}



if ($method === 'POST'){
  header("Location: http://localhost:3000/admin-routes");
  exit();
}

// $row = [
//   'route_id' => 1,
//   'busNumber' => 1,
//   'start' => '0600',
//   'end' => '2300',
//   'line_name' => 'C'
// ];


// $data = [];
// while ($row = mysqli_fetch_assoc($result)) {
//   $routeId = $row['route_id'];
//   $busInfo = [
//     'number' => $row['bus_number'],
//     'start' => $row['start_time'],
//     'end' => $row['end']
//   ];
//   unset($row['busNumber']);
//   unset($row['start']);
//   unset($row['end']);
//   if (!isset($data[$routeId])) {
//     $row['buses'] = [$busInfo];
//     $data[$routeId] = $row;
//   } else {
//     $data[$routeId]['buses'][] = $busInfo;
//   }
// }

?>
