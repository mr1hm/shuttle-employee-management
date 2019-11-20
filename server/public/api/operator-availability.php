<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$data = getBodyData();
$userId = $data['user_id'];
$availability = $data['availability'];
$sessionId = $data['session_id'];

function buildStartEndArray($availability) {
  $startEndArray = [];
  foreach($availability as $day => $dayArray) {
    $indexTimes = [ 0 => 600, 1 => 615, 2 => 630, 3 => 645, 4 => 700, 5 => 715, 6 => 730, 7 => 745, 8 => 800, 9 => 815, 10 => 830, 11 => 845, 12 => 900, 13 => 915, 14 => 930, 15 => 945, 16 => 1000, 17 => 1015, 18 => 1030, 19 => 1045, 20 => 1100, 21 => 1115, 22 => 1130, 23 => 1145, 24 => 1200, 25 => 1215, 26 => 1230, 27 => 1245, 28 => 1300, 29 => 1315, 30 => 1330, 31 => 1345, 32 => 1400, 33 => 1415, 34 => 1430, 35 => 1445, 36 => 1500, 37 => 1515, 38 => 1530, 39 => 1545, 40 => 1600, 41 => 1615, 42 => 1630, 43 => 1645, 44 => 1700, 45 => 1715, 46 => 1730, 47 => 1745, 48 => 1800, 49 => 1815, 50 => 1830, 51 => 1845, 52 => 1900, 53 => 1915, 54 => 1930, 55 => 1945, 56 => 2000, 57 => 2015, 58 => 2030, 59 => 2045, 60 => 2100, 61 => 2115, 62 => 2130, 63 => 2145, 64 => 2200, 65 => 2215, 66 => 2230, 67 => 2245, 68 => 2300, 69 => 2315, 70 => 2330, 71 => 2345, 72=> 2400 ];
    $temporaryArray = [];
    for ($hourIndex = 0; $hourIndex < 72; $hourIndex++) {
      if ($hourIndex === 0 and $dayArray[$hourIndex] === 1) {
        array_push($temporaryArray, $day);
        array_push($temporaryArray, 600);
      } if ($hourIndex !== 0 and $dayArray[$hourIndex -1] === 0 and $dayArray[$hourIndex] === 1) {
        array_push($temporaryArray, $day);
        array_push($temporaryArray, $indexTimes[$hourIndex]);
      } if ($hourIndex !== 0 and $dayArray[$hourIndex -1] === 1 and $dayArray[$hourIndex] === 0) {
        array_push($temporaryArray, $indexTimes[$hourIndex]);
      } if ($hourIndex === 71 and $dayArray[$hourIndex] === 1) {
        array_push($temporaryArray, 2400);
      }if (count($temporaryArray) === 3) {
        array_push($startEndArray, $temporaryArray);
        print_r($temporaryArray);
        $temporaryArray = [];
      }
    }
  }
  return $startEndArray;
}

function deleteCurrentAvailabilityInDatabase($conn, $userId, $sessionId) {
  $deleteQuery = "DELETE FROM operator_availability
                  WHERE user_id = $userId AND session_id = $sessionId";

  $result = mysqli_query($conn, $deleteQuery);
  if(!$result){
    throw new Exception('MySQL delete error: '.mysqli_error($conn));
  }
}

function updateOperatorAvailabilityInDatabase($conn, $arrayOfAvailableShifts, $userId, $sessionId) {
  $length = count($arrayOfAvailableShifts);
  for( $index=0; $index < $length; $index++ ){
    $day = $arrayOfAvailableShifts[$index][0];
    $shortDay = substr($day, 0, 3);
    $startTime = $arrayOfAvailableShifts[$index][1];
    $endTime = $arrayOfAvailableShifts[$index][2];
    $updateQuery = "INSERT INTO operator_availability (
                    id,
                    user_id,
                    session_id,
                    day_of_week,
                    start_time,
                    end_time,
                    cont_block)
                    VALUES (
                    null,
                    $userId,
                    $sessionId,
                    '$shortDay',
                    $startTime,
                    $endTime,
                    0)";

    $result = mysqli_query($conn, $updateQuery);
    if(!$result){
      throw new Exception('MySQL update error: '.mysqli_error($conn));
    }
  }
}

$arrayOfAvailableShifts = buildStartEndArray($availability);
deleteCurrentAvailabilityInDatabase($conn, $userId, $sessionId);
updateOperatorAvailabilityInDatabase($conn, $arrayOfAvailableShifts, $userId, $sessionId);

?>
