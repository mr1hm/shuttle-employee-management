<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';

if (isset($bodyData['line_name'])) {
  print('add line running');
  $line_name = $bodyData['line_name'];
  $sessionID = $bodyData['session_id'];
  $status = $bodyData['status'];
  $roundDuration = $bodyData['roundDuration'];
  $public = $bodyData['public'];
  $regularService = $bodyData['regularService'];
  $specialDriver = $bodyData['specialDriver'];

  $query = "INSERT INTO `route` (`line_name`, `session_id`, `status`, `roundDuration`, `public`, `regularService`, `specialDriver`)
              VALUES ('$line_name', '$sessionID', '$status', '$roundDuration', '$public', '$regularService', '$specialDriver')";

} else if (isset($bodyData['route_id'])) {

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

}

$result = mysqli_query($conn, $query);

if (!$result) {
  throw new Exception('mysql error' . mysqli_error($conn));
}

if (isset($bodyData['line_name'])) {

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

} else if (isset($bodyData['route_id'])) {

  $query = "SELECT * FROM `bus_info`";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysqli error' . mysqli_error($conn));
  }

  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data = $row;
  }

  print(json_encode($data));

}

?>
