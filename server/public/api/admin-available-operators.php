<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$max_weekly_hours = 19.5;

if(!empty($_GET['date'])){
  $date_to_check = $_GET['date'];
} else {
  throw new Exception('no date');
}
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

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $date = $row['date'];
  $id = $row['user_id'];
  $line_bus = $row['line_name'] . $row['bus_number'];
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
  if(empty($data[$date][$id]['rounds'][$line_bus])){
    $data[$date][$id]['rounds'][$line_bus] = [];
  }
  $data[$date][$id]['rounds'][$line_bus][] = [
    'round_id' => $row['round_id'],
    'start_time' => $row['round_start'],
    'stop_time' => $row['round_end']
  ];
}
// total hours for each day for each operator
foreach($data as &$date){
  foreach($date as &$id){
    $total_hours = 0;
    foreach($id['rounds'] as $line){
      $total_hours += calculateTotalHours($line);
    }
    $id['total_hours'] = $total_hours;
  }
}
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
// return an array of operators according to the hours scheduled for that day
// lowest hours first, highest hours last
function operatorsOrderedByDailyHours($operators){
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
        'weeklyHours' => $operator_data['weekly_hours']
      ];
    } else {
      $number_operators_ordered = count($operators_ordered);
      for ($operator_index = 0; $operator_index < $number_operators_ordered; $operator_index++) {
        $operator_inserted = false;
        if ($operator_data['total_hours'] < $operators_ordered[$operator_index]['totalHours']) {
          array_splice($operators_ordered, $operator_index, 0, [[
            'id' => $id,
            'rounds' => $operator_data['rounds'],
            'firstName' => $operator_data['first_name'],
            'lastName' => $operator_data['last_name'],
            'specialRouteOk' => $operator_data['special_route_ok'],
            'totalHours' => $operator_data['total_hours'],
            'weeklyHours' => $operator_data['weekly_hours']
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
            'weeklyHours' => $operator_data['weekly_hours']
          ];
          break;
        }
      }
    }
  }
  return $operators_ordered;
}
// check if rounds to assign start at 6am and if they do make sure the operators
// did not have a shift that ended after 10pm the previous day
function operatorsCanTakeEarlyStartTimes($operators, $times, $conn, $date_to_check){
  for ($times_index = 0; $times_index < count($times); $times_index++){
    if($times[$times_index]['start_time'] < 800){
      foreach($operators as $id=>$operator_data){
        $query = "SELECT round.user_id AS user_id FROM round
                  WHERE round.user_id = $id AND round.end_time > 2200 AND round.date = $date_to_check - 86400";
        $result = mysqli_query($conn, $query);
        if (!$result) {
          throw new Exception('mysql error ' . mysqli_error($conn));
        }
        $row = mysqli_fetch_assoc($result);
        if ((int)$row['user_id'] === $id){
          unset($operators[$id]);
        }
      }
    }
  }
  return $operators;
}

// check if scheduled rounds and shifts to add are no more than 5 hours
// without a 30 min (consecutive) break within the 5 hour block
// if a shift is 5 hours without a 30 min break the next shift has to come at least 30 min later
function operatorsUnderMaxConsecutiveHours($operators, $times){
  $operators_under_consecutive_max = [];
  foreach($operators as $id=>$operator_data){
    $operator_shifts = [];
    $operator_available = true;
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
    foreach($operator_data['rounds'] as $line){
      for ($line_index = 0; $line_index < count($line); $line_index++){
        $time = [
          'start_time' => (int)$line[$line_index]['start_time'],
          'stop_time' => (int)$line[$line_index]['stop_time']
        ];
        $operator_shifts = insertTimeInOrder($operator_shifts, $time);
      }
    }
    // check if shift added is to early or too late for same day compared to assigned shifts
    $operator_available = operatorCanTakeEarlyOrLateShift($operator_shifts);
    // go through the shifts and check for 5 hour blocks without a 30 min break
    // also check for a shift earlier than 8am and if there is one make sure no shift after 9pm gets added
    if($operator_available){
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
          $operator_available = false;
          break;
        }
        $previous_shift = $current_shift;
      }
    }
    if($operator_available){
      $operators_under_consecutive_max[$id] = $operators[$id];
    }
  }
  return $operators_under_consecutive_max;
}
// check if operator has an early start time (before 8am)
// and a late stop time (after 9pm)
// if they do, they cannot take the shifts
function operatorCanTakeEarlyOrLateShift($times){
  $earliest_shift_start = $times[0]['start_time'];
  $latest_shift_stop = $times[count($times) - 1]['stop_time'];
  if ($earliest_shift_start < 800 && $latest_shift_stop > 2100){
    return false;
  }
  return true;
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
// returns all operators available for current day
function operatorsAvailableForDate($data, $date){
  $operators = [];
  foreach($data[$date] as $id=>$value){
    if( $id != 1){
      $operators[$id] = $value;
    }
  }
  return $operators;
}
// returns all operators that would still be under the weekly limit
function operatorsUnderMaxWeeklyHours($operators, $data, $round_time_total_hours){
  $operators_under_weekly_max = [];
  global $max_weekly_hours;
  foreach ($operators as $id => $operator_data) {
    $weekly_total_hours = $round_time_total_hours;
    foreach ($data as $day) {
      if (!empty($day[$id])) {
        $weekly_total_hours += $day[$id]['total_hours'];
      }
    }
    if ($weekly_total_hours <= $max_weekly_hours) {
      $operators[$id]['weekly_hours'] = $weekly_total_hours - $round_time_total_hours;
      $operators_under_weekly_max[$id] = $operators[$id];
    }
  }
  return $operators_under_weekly_max;
}
// returns all operators that don't have a schedule conflict
function operatorsAvailableForShift($operators, $times){
  $operators_available = [];
  foreach ($operators as $id=>$operator_data){
    $rounds = $operator_data['rounds'];
    $operator_available = true;
    foreach ($rounds as $line){
      for ($times_index = 0; $times_index < count($times); $times_index++) {
        for ($line_index = 0; $line_index < count($line); $line_index++){
          if (($times[$times_index]['start_time'] < (int)$line[$line_index]['start_time']  && !($times[$times_index]['stop_time'] <= (int)$line[$line_index]['start_time'])) ||
              ($times[$times_index]['start_time'] > (int)$line[$line_index]['start_time']  && !($times[$times_index]['start_time'] >= (int)$line[$line_index]['stop_time'])) ||
              ($times[$times_index]['start_time'] == (int)$line[$line_index]['start_time']) || ($times[$times_index]['stop_time'] == (int) $line[$line_index]['stop_time'])){
            $operator_available = false;
            break;
          }
          if (($times[$times_index]['stop_time']) > 2100 && (int)$line[$line_index]['start_time'] < 800){
            $operator_available = false;
            break;
          }
        }
        if(!$operator_available){
          break;
        }
      }
    }
    if ($operator_available) {
      $operators_available[$id] = $operators[$id];
    }
  }
  return $operators_available;
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

$round_time_total_hours = calculateTotalHours($round_times);
$operators = operatorsAvailableForDate($data, $date_to_check);
$operators = operatorsAvailableForShift($operators, $round_times);
$operators = operatorsCanTakeEarlyStartTimes($operators, $round_times, $conn, $date_to_check);
$operators = operatorsUnderMaxConsecutiveHours($operators, $round_times);
$operators = operatorsUnderMaxWeeklyHours($operators, $data, $round_time_total_hours);
$operators = operatorsOrderedByDailyHours($operators);
print(json_encode($operators));

?>
