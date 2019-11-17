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
  $lastNight = strtotime('-1 day', $date);
  $query = "SELECT `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND
                  `date` = {$lastNight} AND
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
            WHERE `user_id` = {$operator_id} AND `date` = {$date}";
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
  $day = date('D', $date);
  $weekStart = null;
  $weekEnd = null;
  foreach ( $week as $index => $weekDay ) {
    if ( $day === $weekDay ) {
      $weekStart = strtotime("-$index days", $date);
      $difference = count($week) - $index - 1;
      $weekEnd = strtotime("+$difference days", $date);
      break;
    }
  }
  unset($weekDay);

  $query = "SELECT `start_time`, `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND
                  `date` >= {$weekStart} AND `date` <= {$weekEnd}";
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
// 1566619200 Sat ^
// 1566446400 Thu |
// 1566100800 Sun |

function getOperatorInfo ($operator_id, $date) {
  global $conn;
  $day = date('D', $date);

  $query = "SELECT `u`.`id` AS 'user_id', `u`.`last_name`, `u`.`first_name`, `u`.`special_route_ok` AS 'special_route',
                   CONCAT(`avail`.`start_time`, ',', `avail`.`end_time`) AS 'availability',
                   CONCAT(`r`.`start_time`, ',', `r`.`end_time`) AS 'assigned'
            FROM `user` AS `u`
            JOIN `operator_availability` AS `avail` ON `avail`.`user_id` = `u`.`id`
            JOIN `round` AS `r` ON `r`.`user_id` = `u`.`id` AND `r`.`date` = {$date}
            WHERE `u`.`role` = 'operator' AND `u`.`status` = 'active' AND
                  `avail`.`session_id` = 1 AND `avail`.`user_id` = {$operator_id} AND `avail`.`day_of_week` = '{$day}'
            ORDER BY `r`.`start_time` ASC";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $operatorInfo = [];
  $operatorInfo['user_id'] = null;
  $operatorInfo['last_name'] = '';
  $operatorInfo['first_name'] = '';
  $operatorInfo['special_route'] = 0;
  $operatorInfo['available_times'] = [];
  $operatorInfo['assigned_times'] = [];
  while ( $row = mysqli_fetch_assoc($result) ) {
    if ( !isset($operatorInfo['user_id']) ) {
      $operatorInfo['user_id'] = intval($row['user_id']);
      $operatorInfo['last_name'] = $row['last_name'];
      $operatorInfo['first_name'] = $row['first_name'];
      $operatorInfo['special_route'] = $row['special_route'];
    }
    $operatorInfo['available_times'][] = explode(',', $row['availability']);
    editAssignedTimes($operatorInfo, explode(',', $row['assigned']));
  }
  if ( count($operatorInfo['available_times']) > 1 ) {
    if ( $operatorInfo['available_times'][0] === $operatorInfo['available_times'][1] ) {
      $singleAvailability = $operatorInfo['available_times'][0];
      $operatorInfo['available_times'] = [];
      $operatorInfo['available_times'][] = $singleAvailability;
    }
  }

  foreach ($operatorInfo['assigned_times'] as $timeBlock) {
    editAvailableTimes($operatorInfo, $timeBlock);
  }

  return $operatorInfo;
}


function addRemainingFields (&$operator, $date) {
  $operator['shift_restrictions'] = [
    'worked_passed_10' => hadShiftPassed10($operator['user_id'], $date),
    'shift_passed_15_hour_window' => [ 'shift_start' => 0 ]
  ];
  $operator['total_daily_minutes'] = determineDailyMinutes($operator['user_id'], $date);
  $operator['total_weekly_minutes'] = determineWeeklyMinutes($operator['user_id'], $date);
}

?>
