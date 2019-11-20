<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';

if (isset($bodyData['line_name'])) { // add a new line

  $line_name = $bodyData['line_name'];
  $sessionID = $bodyData['session_id'];
  $status = $bodyData['status'];
  $roundDuration = $bodyData['roundDuration'];
  $public = $bodyData['public'];
  $regularService = $bodyData['regularService'];
  $specialDriver = $bodyData['specialDriver'];

  $query = "INSERT INTO `route` (`line_name`, `session_id`, `status`, `roundDuration`, `public`, `regularService`, `specialDriver`)
              VALUES ('$line_name', '$sessionID', '$status', '$roundDuration', '$public', '$regularService', '$specialDriver')";

  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }

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

} else if (isset($bodyData['route_id'])) { // add a new bus

  $busNumber = $bodyData['bus_number'];
  $startTime = $bodyData['start_time'];
  $rounds = $bodyData['rounds'];
  $endTime = $bodyData['end_time'];
  $idRoute = $bodyData['route_id'];
  $vehicleID = $bodyData['vehicle_id'];
  $openingDuration = $bodyData['opening_duration'];
  $closingDuration = $bodyData['closing_duration'];
  $sessionID = $bodyData['session_id'];
  $userID = $bodyData['userID'];
  $date = $bodyData['date'];
  // $scheduleStatus = $bodyData['status'];

  $transactionResult = mysqli_query($conn, 'START TRANSACTION');

  if (!$transactionResult) {
    throw new Exception('could not start transaction' . mysqli_error($conn));
  }

  $busInsertQuery = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `rounds`, `end_time`, `route_id`, `vehicle_id`, `opening_duration`, `closing_duration`)
              VALUES ('$busNumber', '$startTime', '$rounds', '$endTime', '$idRoute', '$vehicleID', '$openingDuration', '$closingDuration')";
  $result = mysqli_query($conn, $busInsertQuery);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }

  $roundInsertQuery = "INSERT INTO `round` (`bus_info_id`, `session_id`, `user_id`, `date`, `start_time`, `end_time`)
                VALUES (LAST_INSERT_ID(), $sessionID, $userID, $date, $startTime, $endTime)";
  $result = mysqli_query($conn, $roundInsertQuery);

  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }

  if (isset($bodyData['gap'])) { // add gaps to busGaps table

    $busGapsInsertQuery = "INSERT INTO `busGaps` (`bus_id`, `gapStartTime`, `gapDuration`) VALUES";

    foreach ($bodyData['gap'] as $index => $value) {

      $gapStartTime = $value;
      $gapDuration = $bodyData['gapDuration'][$index];
      $busGapsInsertQuery .= "(LAST_INSERT_ID(), '$value', '$gapDuration')";

      $result = mysqli_query($conn, $busGapsInsertQuery);

      if (!$result) {
        throw new Exception('mysqli error ' . mysqli_error($conn));
      }

    }
  }

  if (isset($bodyData['daysActive'])) { // add days active to busDaysActive table

      $busDaysActiveQuery = "INSERT INTO `busDaysActive` (`bus_id`, `daysActive`) VALUES";

      foreach ($bodyData['daysActive'] as $value) { // errors out here.

        $daysActive = $value;
        $busDaysActiveQuery .= "(LAST_INSERT_ID(), '$value')";

        $result = mysqli_query($conn, $busDaysActiveQuery);

        if (!$result) {
          throw new Exception('mysql error ' . mysqli_error($conn));
        }

      }
  }

  if (mysqli_affected_rows($conn) === 0) {
    mysqli_query($conn, 'ROLLBACK');
    throw new Exception('unable to insert/update bus and round info');
  }

  $transactionResult = mysqli_query($conn, 'COMMIT');

}

if (isset($bodyData['route_id'])) {

  $query = "SELECT bi.`id`, bi.`bus_number`, bi.`start_time`, bi.`end_time`, r.`session_id`, r.`user_id`, r.`bus_info_id`, r.`start_time`, r.`end_time`
            FROM `bus_info` AS bi, `round` AS r
            WHERE bi.`id` = r.`bus_info_id`";
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
