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
  $roundDuration = $bodyData['roundDuration'];
  $roundTimes = $bodyData['roundTimes'];
  $endTime = $bodyData['end_time'];
  $daysActive = $bodyData['daysActive'];
  $daysActiveArr = explode(", ", $daysActive);
  $dayOffset = getDayOffsets($daysActiveArr);
  $idRoute = $bodyData['route_id'];
  $vehicleID = $bodyData['vehicle_id'];
  $gap = $bodyData['gap'];
  $gapDuration = $bodyData['gapDuration'];
  $openingDuration = $bodyData['opening_duration'];
  $closingDuration = $bodyData['closing_duration'];
  $sessionID = $bodyData['session_id'];
  $userID = $bodyData['userID'];
  $date = $bodyData['date'];
  $status = $bodyData['status'];

  $sessionQuery = "SELECT * FROM `session` WHERE `session`.`id` = $sessionID";
  $result = mysqli_query($conn, $sessionQuery);
  if (!$result) {
    throw new Exception('mysql error' . mysqli_error($conn));
  }
  $row = mysqli_fetch_assoc($result);
  $sessionStart = $row['startDateString'];
  $sessionEnd = $row['endDateString'];

  $transactionResult = mysqli_query($conn, 'START TRANSACTION');

  if (!$transactionResult) {
    throw new Exception('could not start transaction' . mysqli_error($conn));
  }

  $busInsertQuery = "INSERT INTO `bus_info` (`bus_number`, `start_time`, `rounds`, `end_time`, `daysActive`, `route_id`, `vehicle_id`, `gap`, `gapDuration`, `opening_duration`, `closing_duration`)
              VALUES ('$busNumber', '$startTime', '$rounds', '$endTime', '$daysActive', '$idRoute', '$vehicleID', '$gap', '$gapDuration', '$openingDuration', '$closingDuration')";
  $result = mysqli_query($conn, $busInsertQuery);

  if (!$result) {
    throw new Exception('mysql add bus error ' . mysqli_error($conn));
  }

  $idQuery = "SELECT LAST_INSERT_ID() AS id";
  $result = mysqli_query($conn, $idQuery);
  $row = mysqli_fetch_assoc($result);
  $busInfoId = $row['id'];

  $date = strtotime($sessionStart);
  for ( $sessionStart; $sessionStart < $sessionEnd;) {
    for ($dayIndex = 0; $dayIndex < count($dayOffset); $dayIndex++) {
      $offSet = $dayOffset[$dayIndex];
      if ($offSet === 0) {
        $dateToAdd = date("Y-m-d", $date);
      } else if ($offSet === 1) {
        $dateToAdd = date("Y-m-d", strtotime("+1 day", $date));
      } else {
        $dateToAdd = date("Y-m-d", strtotime("+$offSet days", $date));
      }
      for ($roundIndex = 0; $roundIndex < count($roundTimes); $roundIndex++) {
        $startTime = $roundTimes[$roundIndex]['start_time'];
        $endTime = $roundTimes[$roundIndex]['end_time'];
        $roundInsertQuery = "INSERT INTO `round` (`bus_info_id`, `session_id`, `user_id`, `date`, `start_time`, `end_time`, `status`)
                VALUES ('$busInfoId', '$sessionID', '$userID', '$dateToAdd', '$startTime', '$endTime', '$status')";
        $result = mysqli_query($conn, $roundInsertQuery);

        if (!$result) {
          throw new Exception('mysql add round error ' . mysqli_error($conn));
        }
      }
    }
    $date = strtotime("+1 week", strtotime($sessionStart));
    $sessionStart = date("Y-m-d", $date);
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

function getDayOffsets( $dayArr ) {
  $day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $keys = [];
  for ($dayArrIndex = 0; $dayArrIndex < count($dayArr); $dayArrIndex++) {
    array_push($keys, array_search($dayArr[$dayArrIndex], $day));
  }
  return $keys;
}

?>
