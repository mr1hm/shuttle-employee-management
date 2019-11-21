<?php
require_once('operator-functions.php');

$utc_offset = 25200;
$max_weekly_hours = 19.5;
$not_available_reasons = [
  'unavailable to work today',
  'unavailable to work during shift',
  'already scheduled during shift',
  'cannot work more than 5 hours without a 30 minute break',
  'cannot work before 8am if shift ended after 10pm night before',
  'cannot work before 8am and after 9pm on the same day',
  'hours will exceed daily maximum',
  'hours will exceed weekly maximum',
  'not authorized for special route'
];

if(!empty($_GET['date'])){
  $date_to_check = $_GET['date'];
} else {
  throw new Exception('no date');
}
$day_of_week = date('D', strtotime($date_to_check));

if (!empty($_GET['sunday'])) {
  $sunday = $_GET['sunday'];
} else {
  throw new Exception('no beginning of week');
}
if (!empty($_GET['saturday'])) {
  $saturday = $_GET['saturday'];
} else {
  throw new Exception('no end of week');
}
if(!empty($_GET['round_time'])){
  $round_times = json_decode($_GET['round_time'], true);
} else {
  throw new Exception('no round times');
}
for ($round_index = 0; $round_index < count($round_times); $round_index++){
  $round_times[$round_index]['start_time'] = (int)$round_times[$round_index]['start_time'];
  $round_times[$round_index]['stop_time'] = (int)$round_times[$round_index]['stop_time'];
}
if(!checkIfTimesOverlap($round_times)){
  print(json_encode([]));
  exit;
}
$query = "SELECT
          rd.id AS round_id,
          rt.line_name,
          bi.bus_number,
          rd.start_time AS round_start,
          rd.end_time AS round_end,
          us.id AS user_id,
          us.last_name,
          us.first_name,
          us.special_route_ok,
          rd.date,
          rd.status
          FROM route AS rt
          JOIN bus_info AS bi ON bi.route_id = rt.id
          JOIN round AS rd ON rd.bus_info_id = bi.id
          JOIN user AS us ON rd.user_id = us.id
          WHERE rd.date >= '$sunday' AND rd.date <= '$saturday'
          ORDER BY rd.date ASC, line_name ASC, bus_number ASC, round_start ASC";

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
// organize data by day of week
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $date = $row['date'];
  $id = $row['user_id'];
  if(empty($data[$date])){
    $data[$date] = [];
function validParameters () {
  if ( empty($_GET['date']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['round_time']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['line_bus']) ) {
    throw new Exception('No line/bus supplied');
  }
  return true;
}

global $conn;
if (validParameters()) {
  $date = $_GET['date'];
  $shift = json_decode($_GET['round_time'], true);
  $line_bus = $_GET['line_bus'];
  $shift[0]['line_name'] = preg_filter('/\d/', '', $line_bus);

  $query = "SELECT `id` AS 'user_id'
            FROM `user`
            WHERE `role` = 'operator' AND `status` = 'active'";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }

  $operators = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $operators[] = getOperator($row['user_id'], $date);
  }
  foreach ($operators as &$operator) {
    $unavailable = canTakeShift($operator, $shift, $conn, 1);
    $operator['available'] = !$unavailable;
    $operator['unavailable_reasons'] = $unavailable ?? null;
  }
  unset($operator);
  ob_clean();
  print(json_encode($operators));
}
