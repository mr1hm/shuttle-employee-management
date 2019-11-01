<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

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
$day_of_week = date('D', $date_to_check);

if (!empty($_GET['sunday'])) {
  $sunday = (int)$_GET['sunday'];
} else {
  throw new Exception('no beginning of week');
}
if (!empty($_GET['saturday'])) {
  $saturday = (int)$_GET['saturday'];
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
          WHERE rd.date >= $sunday AND rd.date <= $saturday
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
  }
  if(empty($data[$date][$id])){
    $data[$date][$id] = [];
    $data[$date][$id]['rounds'] = [];
    $data[$date][$id]['first_name'] = $row['first_name'];
    $data[$date][$id]['last_name'] = $row['last_name'];
    $data[$date][$id]['special_route_ok'] = $row['special_route_ok'];
    $data[$date][$id]['total_hours'] = null;
  }
  $data[$date][$id]['rounds'][] = [
    'round_id' => $row['round_id'],
    'start_time' => $row['round_start'],
    'stop_time' => $row['round_end'],
    'line_bus' => $row['line_name'] . $row['bus_number']
  ];
}

// get all operators available for the day
$query = "SELECT oa.user_id, oa.day_of_week, oa.start_time, oa.end_time, u.first_name, u.last_name, u.special_route_ok
          FROM operator_availability AS oa
          JOIN user AS u ON oa.user_id = u.id
          WHERE day_of_week = '$day_of_week'";

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$operator_availability = [];
// sort operators in assoc array by operator id
while ($row = mysqli_fetch_assoc($result)) {
  $id = $row['user_id'];
  if (empty($operator_availability[$id])){
    $operator_availability[$id] = [];
    $operator_availability[$id]['first_name'] = $row['first_name'];
    $operator_availability[$id]['last_name'] = $row['last_name'];
    $operator_availability[$id]['times_available'] = [];
    $operator_availability[$id]['special_route_ok'] = $row['special_route_ok'];
  }
  $operator_availability[$id]['times_available'][] = [
    'start_time' => $row['start_time'],
    'end_time' => $row['end_time']
  ];
}
// add available operators to data if they weren't scheduled
foreach($operator_availability as $id=>$availability_data){
  if(empty($data[$date_to_check][$id])){
    $data[$date_to_check][$id] = [];
    $data[$date_to_check][$id]['rounds'] = [];
    $data[$date_to_check][$id]['first_name'] = $availability_data['first_name'];
    $data[$date_to_check][$id]['last_name'] = $availability_data['last_name'];
    $data[$date_to_check][$id]['special_route_ok'] = $availability_data['special_route_ok'];
    $data[$date_to_check][$id]['total_hours'] = null;
  }
}
// total hours for each day for each operator
foreach($data as &$date){
  foreach($date as &$operator){
    $operator['total_hours'] = calculateTotalHours($operator['rounds']);
  }
}
$round_time_total_hours = calculateTotalHours($round_times);

$operators = [];
operatorsAvailableForDate($operators, $data, $date_to_check);
operatorsAvailableForShift($operators, $round_times);
operatorsCanTakeEarlyStartTimes($operators, $round_times, $conn, $date_to_check);
operatorsUnderMaxConsecutiveHours($operators, $round_times);
operatorsUnderMaxWeeklyHours($operators, $data, $round_time_total_hours);
operatorsOrderedByDailyHours($operators);
print(json_encode($operators));

// check if times overlap, return true if they don't, return false if they do
function checkIfTimesOverlap($times){
  $noOverlap = true;
  for($time_index1 = 0; $time_index1 < count($times); $time_index1++){
    for($time_index2 = 0; $time_index2 < count($times); $time_index2++){
      if ($time_index1 !== $time_index2){
        if (($times[$time_index1]['start_time'] < $times[$time_index2]['start_time']  && !($times[$time_index1]['stop_time'] <= $times[$time_index2]['start_time'])) ||
            ($times[$time_index1]['start_time'] > $times[$time_index2]['start_time']  && !($times[$time_index1]['start_time'] >= $times[$time_index2]['stop_time'])) ||
            ($times[$time_index1]['start_time'] == $times[$time_index2]['start_time']) || ($times[$time_index1]['stop_time'] ==  $times[$time_index2]['stop_time'])){
          $noOverlap = false;
          break;
        }
      }
    }
    if(!$noOverlap){
      break;
    }
  }
  return $noOverlap;
}
// sorts operators according to the hours scheduled for that day
// lowest hours first, highest hours last
function operatorsOrderedByDailyHours(&$operators){
  $operators_ordered = [];
  foreach($operators as $id=>$operator_data){
    if (count($operators_ordered) === 0){
      $operators_ordered[] = [
        'id' => $id,
        'rounds' => $operator_data['rounds'],
        'firstName' => $operator_data['first_name'],
        'lastName' => $operator_data['last_name'],
        'specialRouteOk' => $operator_data['special_route_ok'],
        'totalHours' => $operator_data['total_hours'],
        'weeklyHours' => $operator_data['weekly_hours'],
        'availability' => $operator_data['availability']
      ];
    } else {
      $number_operators_ordered = count($operators_ordered);
      for ($operator_index = 0; $operator_index < $number_operators_ordered; $operator_index++) {
        if ($operator_data['total_hours'] < $operators_ordered[$operator_index]['totalHours']) {
          array_splice($operators_ordered, $operator_index, 0, [[
            'id' => $id,
            'rounds' => $operator_data['rounds'],
            'firstName' => $operator_data['first_name'],
            'lastName' => $operator_data['last_name'],
            'specialRouteOk' => $operator_data['special_route_ok'],
            'totalHours' => $operator_data['total_hours'],
            'weeklyHours' => $operator_data['weekly_hours'],
            'availability' => $operator_data['availability']
          ]]);
          break;
        } else if ($operator_index === $number_operators_ordered - 1) {
          $operators_ordered[] = [
            'id' => $id,
            'rounds' => $operator_data['rounds'],
            'firstName' => $operator_data['first_name'],
            'lastName' => $operator_data['last_name'],
            'specialRouteOk' => $operator_data['special_route_ok'],
            'totalHours' => $operator_data['total_hours'],
            'weeklyHours' => $operator_data['weekly_hours'],
            'availability' => $operator_data['availability']
          ];
          break;
        }
      }
    }
  }
  $operators = $operators_ordered;
}
// check if rounds to assign start at 6am and if they do make sure the operators
// did not have a shift that ended after 10pm the previous day
function operatorsCanTakeEarlyStartTimes(&$operators, $times, $conn, $date_to_check){
  global $not_available_reasons;
  for ($times_index = 0; $times_index < count($times); $times_index++){
    if($times[$times_index]['start_time'] < 800){
      foreach($operators as $id=>&$operator_data){
        $query = "SELECT round.user_id AS user_id FROM round
                  WHERE round.user_id = $id AND round.end_time > 2200 AND round.date = $date_to_check - 86400";
        $result = mysqli_query($conn, $query);
        if (!$result) {
          throw new Exception('mysql error ' . mysqli_error($conn));
        }
        $row = mysqli_fetch_assoc($result);
        if ((int)$row['user_id'] === $id){
          $operator_data['availability']['available'] = false;
          $operator_data['availability']['reasons'][] = $not_available_reasons[4];
        }
      }
      break;
    }
  }
}
// check if scheduled rounds and shifts to add are no more than 5 hours
// without a 30 min (consecutive) break within the 5 hour block
// if a shift is 5 hours without a 30 min break the next shift has to come at least 30 min later
function operatorsUnderMaxConsecutiveHours(&$operators, $times){
  global $not_available_reasons;
  foreach($operators as $id=>&$operator_data){
    $operator_shifts = [];
    // make an array for an operator($id) with all the shifts in order
    // add the times of the rounds you want to assign to the previous shifts array in order
    for($times_index = 0; $times_index < count($times); $times_index++){
      $time = [
        'start_time' => $times[$times_index]['start_time'],
        'stop_time' => $times[$times_index]['stop_time']
      ];
      $operator_shifts = insertTimeInOrder($operator_shifts, $time);
    }
    // add the times of the rounds the operator is already assigned
    for ($rounds_index = 0; $rounds_index < count($operator_data['rounds']); $rounds_index++){
      $time = [
        'start_time' => (int) $operator_data['rounds'][$rounds_index]['start_time'],
        'stop_time' => (int) $operator_data['rounds'][$rounds_index]['stop_time']
      ];
      $operator_shifts = insertTimeInOrder($operator_shifts, $time);
    }
    // check if shift added is too early or too late for same day compared to assigned shifts
    operatorCanTakeEarlyOrLateShift($operator_data['availability'], $operator_shifts);
    // go through the shifts and check for 5 hour blocks without a 30 min break
    // also check for a shift earlier than 8am and if there is one make sure no shift after 9pm gets added
    $previous_shift = $operator_shifts[0];
    $consecutive_hours = calculateTotalHours([$previous_shift]);
    for ($shift_index = 1; $shift_index < count($operator_shifts); $shift_index++) {
      $current_shift = $operator_shifts[$shift_index];
      $timeBetweenShifts = [
        'start_time' => $previous_shift['stop_time'],
        'stop_time' => $current_shift['start_time']
      ];
      $hours_between_shift = calculateTotalHours([$timeBetweenShifts]);
      if ($hours_between_shift < .5) {
        $consecutive_hours += calculateTotalHours([$current_shift]);
      } else {
        $consecutive_hours = calculateTotalHours([$current_shift]);
      }
      if ($consecutive_hours > 5) {
        $operator_data['availability']['available'] = false;
        $operator_data['availability']['reasons'][] = $not_available_reasons[3];
        break;
      }
      $previous_shift = $current_shift;
    }
  }
}
// check if operator has an early start time (before 8am) and a late stop time (after 9pm)
// if they do, set availability to false
function operatorCanTakeEarlyOrLateShift(&$operator_availability, $times){
  global $not_available_reasons;
  $earliest_shift_start = $times[0]['start_time'];
  $latest_shift_stop = $times[count($times) - 1]['stop_time'];
  if ($earliest_shift_start < 800 && $latest_shift_stop > 2100){
    $operator_availability['available'] = false;
    $operator_availability['reasons'][] = $not_available_reasons[5];
    return;
  }
}
// insert shift times
function insertTimeInOrder($shifts, $time){
  if(count($shifts) === 0){
    $shifts[] = $time;
    return $shifts;
  }
  $shifts_length = count($shifts);
  for ($shifts_index = 0; $shifts_index < $shifts_length; $shifts_index++){
    if($time['start_time'] < $shifts[$shifts_index]['start_time']){
      array_splice($shifts, $shifts_index, 0, [$time]);
      break;
    }
    if($shifts_index === $shifts_length - 1){
      $shifts[] = $time;
    }
  }
  return $shifts;
}
// adds operators available for current day to $operators assoc array
function operatorsAvailableForDate(&$operators, $data, $date){
  foreach($data[$date] as $id=>$operator_data){
    if( $id != 1){
      $operators[$id] = $operator_data;
      $operators[$id]['availability'] = [
        'available' => true,
        'reasons' => []
      ];
    }
  }
}
// sets availability to false for operators that would be over the weekly limit
function operatorsUnderMaxWeeklyHours(&$operators, $data, $round_time_total_hours){
  global $not_available_reasons;
  global $max_weekly_hours;
  foreach ($operators as $id =>&$operator_data) {
    $weekly_total_hours = $round_time_total_hours;
    foreach ($data as $day) {
      if (!empty($day[$id])) {
        $weekly_total_hours += $day[$id]['total_hours'];
      }
    }
    $operator_data['weekly_hours'] = $weekly_total_hours - $round_time_total_hours;
    if ($weekly_total_hours > $max_weekly_hours) {
      $operator_data['availability']['available'] = false;
      $operator_data['availability']['reasons'][] = $not_available_reasons[7];
    }
  }
}
// sets availibility to false for all operators that have a schedule conflict
function operatorsAvailableForShift(&$operators, $times){
  global $not_available_reasons;
  foreach ($operators as $id=>&$operator_data){
    $rounds = $operator_data['rounds'];
    for ($times_index = 0; $times_index < count($times); $times_index++) {
      for ($round_index = 0; $round_index < count($rounds); $round_index++){
        if (($times[$times_index]['start_time'] < (int)$rounds[$round_index]['start_time']  && !($times[$times_index]['stop_time'] <= (int)$rounds[$round_index]['start_time'])) ||
            ($times[$times_index]['start_time'] > (int)$rounds[$round_index]['start_time']  && !($times[$times_index]['start_time'] >= (int)$rounds[$round_index]['stop_time'])) ||
            ($times[$times_index]['start_time'] == (int)$rounds[$round_index]['start_time']) || ($times[$times_index]['stop_time'] == (int) $rounds[$round_index]['stop_time'])){
          $operator_data['availability']['available'] = false;
          $operator_data['availability']['reasons'][] = $not_available_reasons[2];
          break;
        }
      }
      if(!$operator_data['availability']['available']){
        break;
      }
    }
  }
}
// adds up the hours of an array of objects with keys start_time and stop_time
function calculateTotalHours($times){
  $total_hours = 0;
  for ($times_index = 0; $times_index < count($times); $times_index++){
    $start_time = convert24hrTimeToMinutes( (int)$times[$times_index]['start_time']);
    $end_time = convert24hrTimeToMinutes( (int)$times[$times_index]['stop_time']);
    $round_minutes = $end_time - $start_time;
    $round_hours = $round_minutes / 60;
    $total_hours += $round_hours;
  }
  return round($total_hours, 5);
}
// returns minutes since midnight from military time
function convert24hrTimeToMinutes($time){
  $hours = floor($time / 100);
  $minutes = $time - ($hours * 100);
  return $minutes + ($hours * 60);
}

?>
