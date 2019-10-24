<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

function buildStartEndArray($availability) {
  $indexTimes = [ 0 => 600, 1 => 615, 2 => 630, 3 => 645, 4 => 700, 5 => 715, 6 => 730, 7 => 745, 8 => 800, 9 => 815, 10 => 830, 11 => 845, 12 => 900, 13 => 915, 14 => 930, 15 => 945, 16 => 10, 17 => 1015, 18 => 1030, 19 => 1045, 20 => 1100, 21 => 1115, 22 => 1130, 23 => 1145, 24 => 1200, 25 => 1215, 26 => 1230, 27 => 1245, 28 => 1300, 29 => 1315, 30 => 1330, 31 => 1345, 32 => 1400, 33 => 1415, 34 => 1430, 35 => 1445, 36 => 1500, 37 => 1515, 38 => 1530, 39 => 1545, 40 => 1600, 41 => 1615, 42 => 1630, 43 => 1645, 44 => 1700, 45 => 1715, 46 => 1730, 47 => 1745, 48 => 1800, 49 => 1815, 50 => 1830, 51 => 1845, 52 => 1900, 53 => 1915, 54 => 1930, 55 => 1945, 56 => 2000, 57 => 2015, 58 => 2030, 59 => 2045, 60 => 2100, 61 => 2115, 62 => 2130, 63 => 2145, 64 => 2200, 65 => 2215, 66 => 2230, 67 => 2245, 68 => 2300, 69 => 2315, 70 => 2330, 71 => 2345, 72=> 2400 ];

  $startEndArray = [];
  foreach ($availability as $day) {
    $temporaryArray = [];
    $lengthTemporaryArray = count($temporaryArray);
    for ($hourIndex = 0; $hourIndex < 72; $hourIndex++) {
      if ($hourIndex === 0 and $availability[$day][$hourIndex] === 1) {
        $temporaryArray[] = $availability[$day];
        $temporaryArray[] = 600;
      } if ($hourIndex !== 0 and $availability[$day][$index -1] === 0 and $availability[$day][$index] === 1) {
        $temporaryArray[] = $availability[$day];
        $temporaryArray[] = $indexTimes[$hourIndex];
      } if ($availability[$day][$index -1] === 1 and $availability[$day][$index] === 0) {
        $temporaryArray[] = $indexTimes[$hourIndex];      
      } if ($hourIndex === 71 and $availability[$day][$index] === 1) {
        $temporaryArray[] = 2400;  
      }if ($lengthTemporaryArray === 3) {
        $startEndArray[] = $temporaryArray;
        $temporaryArray = [];
      }
    }
  }
  return $startEndArray;
}

function updateOperatorAvailabilityInDatabase($conn, $arrayOfAvailableShifts) {
  $length = count($arrayOfAvailableShifts);
  for( $index=0; $index < $length; $index++ ){
    //userId from Raul -- hard code for now
    //sessionId - provided by another screen - hard code for now
    $day = $availability[$index][0];
    $startTime = $startEndArray[$index][1];
    $endTime = $startEndArray[$index][2];

    $updateQuery = "INSERT INTO operator_availablity (
                    'user_id', 
                    'session_id', 
                    'day_of_week', 
                    'start_time', 
                    'end_time')
                    VALUES (
                    17, 
                    1, 
                    $day, 
                    $startTime, 
                    $endTime)";

    $result = mysqli_query($conn, $updateQuery);
    if(!$result){
        throw new Exception('MySQL error: '.mysqli_error($conn));
    }
  }
}

$arrayOfAvailableShifts = buildStartEndArray($availability);
updateOperatorAvailabilityInDatabase($conn, $arrayOfAvailableShifts);

?>