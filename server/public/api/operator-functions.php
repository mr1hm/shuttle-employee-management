<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
require_once('shift-restrictions.php');

/**
 * Constructs operator that can be used with the shift restriction functions
 */
function getOperator ($operator_id, $date) {
  $operator = getOperatorInfo($operator_id, $date);
  addRemainingFields($operator, $date);
  return $operator;
}

// Helper functions
function editAvailableTimes(&$operator, $shift) {
  // Remove availability if it is the same as the shift
  $key = array_search($shift, array_column($operator, 'available_times'));
  if ($key !== false) {
    array_splice($operator['available_times'], $key, 1);
    return;
  }

  $shiftStart = intval($shift[0]);
  $shiftEnd = intval($shift[1]);
  foreach ($operator['available_times'] as $key => &$timeBlock) {
    if ($shiftStart === intval($timeBlock[0])) { // Push back start time
      $timeBlock[0] = intval($shiftEnd);
      break;
    }
    if ($shiftEnd === intval($timeBlock[1])) { // Push back end time
      $timeBlock[1] = intval($shiftStart);
      break;
    }
    // If shift is inside of a time block - Break the time block into 2 blocks
    if ($shiftStart > intval($timeBlock[0]) && $shiftEnd < intval($timeBlock[1])) {
      $newBlockEnd = intval($timeBlock[1]);
      $timeBlock[1] = intval($shiftStart);
      array_splice($operator['available_times'], $key + 1, 1, [$key + 1 => [intval($shiftEnd), $newBlockEnd]]);
      break;
    }
  }
}

function editAssignedTimes(&$operator, $shift) {
  $shiftStart = intval($shift[0]);
  $shiftEnd = intval($shift[1]);
  $lastIndex = count($operator['assigned_times']) - 1;

  // Empty assigned times
  if (empty($operator['assigned_times'])) {
    array_push($operator['assigned_times'], [$shiftStart, $shiftEnd]);
    return;
  }

  // Insert at beginning
  if ($shiftEnd <= intval($operator['assigned_times'][0][0])) {
    array_unshift($operator['assigned_times'], [$shiftStart, $shiftEnd]);
    if (intval($operator['assigned_times'][0][1]) === intval($operator['assigned_times'][1][0])) {
      $operator['assigned_times'][0][1] = $operator['assigned_times'][1][1];
      array_splice($operator['assigned_times'], 1, 1);
    }
    return;
  }
  // Insert at end
  if ($shiftStart >= intval($operator['assigned_times'][$lastIndex][1])) {
    array_push($operator['assigned_times'], [$shiftStart, $shiftEnd]);
    $lastIndex = count($operator['assigned_times']) - 1;
    if (intval($operator['assigned_times'][$lastIndex][0]) === intval($operator['assigned_times'][$lastIndex - 1][1])) {
      $operator['assigned_times'][$lastIndex - 1][1] = $operator['assigned_times'][$lastIndex][1];
      array_pop($operator['assigned_times']);
    }
    return;
  }
  // Insert in between
  $prevTimeBlock = null;
  $insertIndex = 0;
  foreach ($operator['assigned_times'] as $key => &$timeBlock) {
    if ($prevTimeBlock && ($shiftStart >= $prevTimeBlock[1] && $shiftEnd <= $timeBlock[0])) {
      $temp = $operator['assigned_times'][$key];
      array_splice($operator['assigned_times'], $key, 1, [[$shiftStart, $shiftEnd]]);
      array_splice($operator['assigned_times'], $key + 1, 1, [$key + 1 => $temp]);
      $insertIndex = $key;
      break;
    }
    $prevTimeBlock = $timeBlock;
  }
  unset($timeBlock);

  /* If inserted shift has start/end times that are equivalent to neighboring
   * shifts - trunctate the shift(s) into a single shift */
  if (intval($operator['assigned_times'][$insertIndex - 1][1]) === intval($operator['assigned_times'][$insertIndex][0])) {
    $operator['assigned_times'][$insertIndex - 1][1] = $operator['assigned_times'][$insertIndex][1];
    array_splice($operator['assigned_times'], $insertIndex, 1);
    --$insertIndex;
  }
  if (isset($operator['assigned_times'][$insertIndex + 1])) {
    if (intval($operator['assigned_times'][$insertIndex + 1][0]) === intval($operator['assigned_times'][$insertIndex][1])) {
      $operator['assigned_times'][$insertIndex + 1][0] = $operator['assigned_times'][$insertIndex][0];
      array_splice($operator['assigned_times'], $insertIndex, 1);
    }
  }
}

function hadShiftPassed10 (int $operator_id, $date) {
  global $conn;
  $yesterday = strtotime('-1 day', strtotime($date));
  $query = "SELECT `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND
                  `date` = '{$yesterday}' AND
                  `end_time` > 2200";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }

  return !!mysqli_affected_rows($conn);
}

function determineDailyMinutes (int $operator_id, $date) {
  global $conn;
  $query = "SELECT `start_time`, `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND `date` = '{$date}'";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $dailyMinutes = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $dailyMinutes += calculateShiftMinutes($row['start_time'], $row['end_time']);
  }

  return intval($dailyMinutes);
}

function determineWeeklyMinutes (int $operator_id, $date) {
  global $conn;
  $week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $day = date('D', strtotime($date));
  $weekStart = null;
  $weekEnd = null;
  foreach ( $week as $index => $weekDay ) {
    if ( $day === $weekDay ) {
      $weekStart = date('Y-m-d', strtotime("-$index days", strtotime($date)));
      $difference = count($week) - $index - 1;
      $weekEnd = date('Y-m-d', strtotime("+$difference days", strtotime($date)));
      break;
    }
  }
  unset($weekDay);

  $query = "SELECT `start_time`, `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND
                  `date` >= '{$weekStart}' AND `date` <= '{$weekEnd}'";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $weeklyMinutes = 0;
  while ( $row = mysqli_fetch_assoc($result) ) {
    $weeklyMinutes += calculateShiftMinutes($row['start_time'], $row['end_time']);
  }

  return intval( $weeklyMinutes );
}

function getOperatorInfo ($operator_id, $date) {
  global $conn;
  $day = date('D', strtotime($date));
  $operatorInfo = [];

  // Get basic user data
  $query = "SELECT `id`, `last_name`, `first_name`, `special_route_ok` AS 'special_route'
            FROM `user`
            WHERE `role` = 'operator' AND `status` = 'active' AND `id` = {$operator_id}";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $result = mysqli_fetch_assoc($result);
  $operatorInfo['user_id'] = $result['id'];
  $operatorInfo['last_name'] = $result['last_name'];
  $operatorInfo['first_name'] = $result['first_name'];
  $operatorInfo['special_route'] = $result['special_route'];


  // Get operator available times
  $query = "SELECT CONCAT(`start_time`, ',', `end_time`) AS 'availability'
            FROM `operator_availability`
            WHERE `user_id` = {$operator_id} AND `day_of_week` = '{$day}' AND `session_id` = 1";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $operatorInfo['available_times'] = [];
  while ( $row = mysqli_fetch_assoc($result) ) {
    $operatorInfo['available_times'][] = explode(',', $row['availability']);
  }

  // Get operator assigned times
  $query = "SELECT CONCAT(`start_time`, ',', `end_time`) AS 'assigned'
            FROM `round`
            WHERE `user_id` = {$operator_id} AND `date` = '{$date}' AND `session_id` = 5";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $operatorInfo['assigned_times'] = [];
  while ($row = mysqli_fetch_assoc($result)) {
    editAssignedTimes($operatorInfo, explode(',', $row['assigned']));
  }

  foreach ($operatorInfo['assigned_times'] as $timeBlock) {
    editAvailableTimes($operatorInfo, $timeBlock);
  }

  return $operatorInfo;
}


function addRemainingFields (&$operator, $date) {
  $operator['shift_restrictions'] = [
    'worked_passed_10' => hadShiftPassed10(intval($operator['user_id']), $date),
    'shift_passed_15_hour_window' => [ 'shift_start' => intval($operator['assigned_times'][0][0]) < 800 ? intval($operator['assigned_times'][0][0]) : 0 ]
  ];
  $operator['total_daily_minutes'] = determineDailyMinutes(intval($operator['user_id']), $date);
  $operator['total_weekly_minutes'] = determineWeeklyMinutes(intval($operator['user_id']), $date);
}

?>
