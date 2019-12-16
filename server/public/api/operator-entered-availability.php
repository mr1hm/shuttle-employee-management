<?php
require_once('../../lib/startup.php');
require_once(AUTH);
require_once("functions.php");

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$data = getBodyData();

if(!isset($data['session_id'])) {
  throw new ApiError(null, 422, 'Missing session id');
}
if(!intval($data['session_id'])) {
  throw new ApiError(null, 422, 'Invalid session id');
}

$session = $data['session_id'];

$availability = [
  'Sunday' => array_fill(0, 72, 0),
  'Monday' => array_fill(0, 72, 0),
  'Tuesday' => array_fill(0, 72, 0),
  'Wednesday' => array_fill(0, 72, 0),
  'Thursday' => array_fill(0, 72, 0),
  'Friday' => array_fill(0, 72, 0),
  'Saturday' => array_fill(0, 72, 0),
];

$timeIndices = [600 => 0, 615 => 1, 630 => 2, 645 => 3, 700 => 4, 715 => 5, 730 => 6, 745 => 7, 800 => 8, 815 => 9, 830 => 10, 845 => 11, 900 => 12, 915 => 13, 930 => 14, 945 => 15, 1000 => 16, 1015 => 17, 1030 => 18, 1045 => 19, 1100 => 20, 1115 => 21, 1130 => 22, 1145 => 23, 1200 => 24, 1215 => 25, 1230 => 26, 1245 => 27, 1300 => 28, 1315 => 29, 1330 => 30, 1345 => 31, 1400 => 32, 1415 => 33, 1430 => 34, 1445 => 35, 1500 => 36, 1515 => 37, 1530 => 38, 1545 => 39, 1600 => 40, 1615 => 41, 1630 => 42, 1645 => 43, 1700 => 44, 1715 => 45, 1730 => 46, 1745 => 47, 1800 => 48, 1815 => 49, 1830 => 50, 1845 => 51, 1900 => 52, 1915 => 53, 1930 => 54, 1945 => 55, 2000 => 56, 2015 => 57, 2030 => 58, 2045 => 59, 2100 => 60, 2115 => 61, 2130 => 62, 2145 => 63, 2200 => 64, 2215 => 65, 2230 => 66, 2245 => 67, 2300 => 68, 2315 => 69, 2330 => 70, 2345 => 71, 2400 => 72];

$dayConversion = ['Sun' => 'Sunday', 'Mon' => 'Monday', 'Tue' => 'Tuesday', 'Wed' => 'Wednesday', 'Thu' => 'Thursday', 'Fri' => 'Friday', 'Sat' => 'Saturday'];

$stmt = $mysqli->prepare("SELECT day_of_week, 
                 start_time, 
                 end_time
          FROM   operator_availability
          WHERE  user_id = ? AND session_id = ?");

$stmt->bind_param('ii', $user['userId'], $session);
$stmt->execute();

$result = $stmt->get_result();

if(!$result) {
  throw new ApiError(null, 500, 'Error getting operators availability');
}

$output = [];

while($row = $result->fetch_assoc()){
  $output[] = $row;
}

for ($outputIndex = 0; $outputIndex < count($output); $outputIndex++) {
  $startTime = $output[$outputIndex]['start_time'];
  $startTimeIndex = $timeIndices[$startTime];
  $endTime = $output[$outputIndex]['end_time'];
  $endTimeIndex = $timeIndices[$endTime]; 
  $day = $output[$outputIndex]['day_of_week'];
  $fullDay = $dayConversion[$day];
  for ($avDayIndex = 0; $avDayIndex < 72; $avDayIndex++) {
    if ($avDayIndex >= $startTimeIndex && $avDayIndex < $endTimeIndex) {
      $availability[$fullDay][$avDayIndex] = 1;
    } 
  }
}

send($availability);
