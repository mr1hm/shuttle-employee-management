<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
require_once('shift-restrictions.php');

function populateSchedule (&$operators, $rounds, $conn, $session) {
  // Traverse through all rounds
  while ( current($rounds) ) {
    $shift = getShift($rounds);
    $madeAssignment = false;

    if ( hasAdequateRounds($shift) ) {
      uasort($operators, 'operatorSort');
      // Traverse operators
      foreach ( $operators as &$operator ) {
        if ( canTakeShift($operator, $shift, $conn) ) {
          assignOperatorToShift($operator, $shift);
          assignShiftToOperator($operator, $shift);
          updateShiftFlags($operator, $shift);

          $madeAssignment = true;
          break;
        }
        unset($operator);
      }

      if ( $madeAssignment ) {
        updateDatabaseRounds($conn, $shift, $session);
      }
      next($rounds);
    }
    next($rounds);
  }
}

/* Returns an associative array containing all of the rounds to be
 * assigned in a shift */
function getShift (&$rounds) {
  $shiftMinutes = 0;
  $shift = [];
  while ( $shiftMinutes < 90 && current($rounds) ) {
    $shift[] = current($rounds);
    $shiftMinutes += calculateShiftMinutes(current($rounds)['round_start'], current($rounds)['round_end']);
    next($rounds);
  }
  prev($rounds);

  return $shift;
}

function updateShiftFlags(&$operator, $shift) {
  if (intval($operator['minutes_without_30_minute_break']) >= 300) {
    $operator['minutes_without_30_minute_break'] -= 300;
  }
  $shiftEnd = intval(end($shift)['round_end']) ? end($shift)['round_end'] : $shift['round_end'];
  if (intval($shiftEnd) > 2200) {
    $operator['shift_restrictions']['worked_passed_10']['current_day'] = true;
  }
  if (intval($operator['assigned_times'][0][0]) < 800) {
    $operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] = intval($operator['assigned_times'][0][0]);
  }
}

  /* Make sure:
   * - All of the rounds in this shift are unassigned to start with
   * - All of the rounds in this shift are on the same line
   * - All of the rounds in this shift are on the same bus */
  function hasAdequateRounds ($shift) {
    foreach ( $shift as $round ) {
      if (intval($round['user_id']) !== 1) return false;
    }
    unset($round);

    $lineName = $shift[0]['line_name'];
    $busNumber = intval($shift[0]['bus_number']);
    foreach ( $shift as $round ) {
      if ( $round['line_name'] !== $lineName ||
          intval($round['bus_number']) !== $busNumber ) return false;
    }
    unset($round);

    return true;
  }

  // Update each round in the shift with the operators information
  function assignOperatorToShift ($operator, &$shift) {
    foreach ( $shift as &$round ) {
      $round['user_id'] = $operator['user_id'];
      $round['last_name'] = $operator['last_name'];
      $round['first_name'] = $operator['first_name'];
      $round['status'] = 'scheduled';
    }
    unset($round);
  }

/* Update operators times_assigned associative array with shift times
   * Update operators times_available associative array
   * Update operators daily & weekly minutes */
function assignShiftToOperator(&$operator, $shift) {
  updateOperatorAssignedTimes($operator, $shift);
  updateOperatorAvailableTimes($operator, $shift);

  $shiftStart = intval(reset($shift)['round_start']) ? reset($shift)['round_start'] : $shift['round_start'];
  $shiftEnd = intval(end($shift)['round_end']) ? end($shift)['round_end'] : $shift['round_end'];
  $shiftTime = calculateShiftMinutes(intval($shiftStart), intval($shiftEnd));
  $operator['minutes_without_30_minute_break'] += $shiftTime;
  $operator['total_daily_minutes'] += $shiftTime;
  $operator['total_weekly_minutes'] += $shiftTime;
}

function updateOperatorAssignedTimes(&$operator, $shift) {
  $shiftStart = intval(reset($shift)['round_start']) ? intval(reset($shift)['round_start']) : intval($shift['round_start']);
  $shiftEnd = intval(end($shift)['round_end']) ? intval(end($shift)['round_end']) : intval($shift['round_end']);
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

function updateOperatorAvailableTimes(&$operator, $shift) {
  // Remove availability if it is the same as the shift
  $key = array_search($shift, array_column($operator, 'available_times'));
  if ($key !== false) {
    array_splice($operator['available_times'], $key, 1);
    return;
  }

  $shiftStart = intval(reset($shift)['round_start']) ? intval(reset($shift)['round_start']) : intval($shift['round_start']);
  $shiftEnd = intval(end($shift)['round_end']) ? intval(end($shift)['round_end']) : intval($shift['round_end']);
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

  // Update all of the rounds in this shift in the database
  function updateDatabaseRounds ($conn, $shift, $session) {
    while ( current($shift) ) {
      $user_id = current($shift)['user_id'];
      $bus_info_id = current($shift)['bus_info_id'];
      $round = [ current($shift)['round_start'], current($shift)['round_end'] ];
      $query = "UPDATE `round`
                SET `user_id` = {$user_id},
                    `status` = 'scheduled'
                WHERE `date` IN ({$session}) AND
                      `bus_info_id` = {$bus_info_id} AND
                      `start_time` = {$round[0]} AND
                      `end_time` = {$round[1]} AND
                      `status` = 'unscheduled'";
      $result = mysqli_query($conn, $query);
      if (!$result) {
        throw new Exception('MySQL error: ' . mysqli_error($conn));
      }
      next($shift);
    }
  }

function getSessionDays ($dayIndex, $sessionStartTimestamp, $sessionEndTimestamp) {
  $day = date("Y-m-d", strtotime("+{$dayIndex} days", strtotime($sessionStartTimestamp)));
  $session = "'$day'" . ',';
  while ($day <= $sessionEndTimestamp) {
    $day = date("Y-m-d", strtotime('+1 week', strtotime($day)));
    $session .= "'$day'" . ',';
  }
  $session = substr($session, 0, -1);
  return $session;
}

  // Sort operators so that they are in order by the operator that has the least amount of weekly minutes
  function operatorSort ($a, $b) {
    if (intval($a['total_weekly_minutes']) === intval($b['total_weekly_minutes'])) {
      return 0;
    } else {
      return (intval($a['total_weekly_minutes']) < intval($b['total_weekly_minutes'])) ? -1 : 1;
    }
  }

// Returns an associative array of rounds for the week
function getRoundsForWeek ($conn, $sessionTimestamp) {
  //TODO: EVENTUALLY REMOVE us.last_name and us.last_name - only for physcial print out/debugging not for db
  $weekdays = [];
  for ($day = 0; $day < 7; ++$day) {
    $weekdays[] = $sessionTimestamp;
    //if ( $day !== 6 ) $weekdays .= ',';
    $sessionTimestamp = date("Y-m-d", strtotime('+1 day', strtotime($sessionTimestamp)));
  }

  $query = "SELECT `rd`.`id`, `rt`.`line_name`, `bi`.`bus_number`, `rd`.`start_time` AS 'round_start', `rd`.`end_time` AS 'round_end',
                   `us`.`id` AS 'user_id', `us`.`last_name`, `us`.`first_name`, `rd`.`date`, `rd`.`status`, `rd`.`bus_info_id`
            FROM `route` AS `rt`
            JOIN `bus_info` AS bi ON `bi`.`route_id` = `rt`.`id`
            JOIN `round` AS rd ON `rd`.`bus_info_id` = `bi`.`id`
            JOIN `user` AS us ON `rd`.`user_id` = `us`.`id`
            WHERE `rd`.`session_id` = 5 AND `rd`.`date` IN ('$weekdays[0]', '$weekdays[1]', '$weekdays[2]', '$weekdays[3]', '$weekdays[4]', '$weekdays[5]', '$weekdays[6]')
            ORDER BY date ASC, line_name ASC, bus_number ASC, round_start ASC, round_end ASC";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }

  $rounds = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $row['day'] = date('D', strtotime($row['date']));
    $rounds[] = $row;
  }
  return $rounds;
}

  // Returns an associative array of operators for the week
  function getOperatorsForWeek ($conn) {
    $query = "SELECT `id` AS 'user_id', `last_name`, `first_name`, `special_route_ok` AS 'special_route'
              FROM `user`
              WHERE `role` = 'operator' AND `status` = 'active'";

    $result = mysqli_query($conn, $query);
    if ( !$result ) {
      throw new Exception('MySQL error: ' . mysqli_error($conn));
    }

    $dayStructure = [
      'available_times' => [],
      'assigned_times' => [],
      'shift_restrictions' => [
        'worked_passed_10' => ['prior_day' => false, 'current_day' => false],
        'shift_passed_15_hour_window' => ['shift_start' => 0]
      ],
      'minutes_without_30_minute_break' => 0,
      'total_daily_minutes' => 0,
      'dates' => []
    ];

    $operatorIds = '';
    $operators = [];
    while ( $row = mysqli_fetch_assoc($result) ) {
      $row['assignment_details'] = [
        'Sun' => $dayStructure,
        'Mon' => $dayStructure,
        'Tue' => $dayStructure,
        'Wed' => $dayStructure,
        'Thu' => $dayStructure,
        'Fri' => $dayStructure,
        'Sat' => $dayStructure
      ];
      $row['total_weekly_minutes'] = 0;
      $operatorIds .= $row['user_id'] . ',';
      $operators[$row['user_id']] = $row;
    }
    $operatorIds = substr($operatorIds, 0, -1);

    $query = "SELECT `user_id`, `day_of_week`, CONCAT(`start_time`, ' , ', `end_time`) AS availability
              FROM `operator_availability`
              WHERE `session_id` = 1 AND `user_id` IN ({$operatorIds})";
    $result = mysqli_query($conn, $query);
    if ( !$result ) {
      throw new Exception('MySQL error: ' . mysqli_error($conn));
    }

    $availability = [];
    while ( $row = mysqli_fetch_assoc($result) ) {
      $availability[] = $row;
    }
    foreach ( $availability as &$available ) {
      $available['availability'] = explode(' , ', $available['availability']);
    }
    unset($available);

    $operatorsAvailability = array_group_by($availability, 'user_id');
    foreach ( $operatorsAvailability as $user_id => $operatorAvailability ) {
      while ( current($operatorAvailability) ) {
        $day = current($operatorAvailability)['day_of_week'];
        $operators[$user_id]['assignment_details'][$day]['available_times'][] = current($operatorAvailability)['availability'];
        next($operatorAvailability);
      }
      reset($operatorAvailability);
    }
    unset($operatorsAvailability);

    return array_values($operators);
  }

  //group all array items with the same key
  function array_group_by (array $array, $key) {
    if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key)) {
      trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);
      return null;
    }
    $func = (!is_string($key) && is_callable($key) ? $key : null);
    $_key = $key;
    // Load the new array, splitting by the target key
    $grouped = [];
    foreach ($array as $value) {
      $key = null;
      if (is_callable($func)) {
        $key = call_user_func($func, $value);
      } elseif (is_object($value) && property_exists($value, $_key)) {
        $key = $value->{$_key};
      } elseif (isset($value[$_key])) {
        $key = $value[$_key];
      }
      if ($key === null) {
        continue;
      }
      $grouped[$key][] = $value;
    }
    // Recursively build a nested grouping if more parameters are supplied
    // Each grouped array value is grouped according to the next sequential key
    if (func_num_args() > 2) {
      $args = func_get_args();
      foreach ($grouped as $key => $value) {
        $params = array_merge([$value], array_slice($args, 2, func_num_args()));
        $grouped[$key] = call_user_func_array('array_group_by', $params);
      }
    }
    return $grouped;
  }

  // Returns an associative array of rounds for the day
  function getRoundsForDay ($rounds, $day) {
    return array_filter($rounds, function ($round) use ($day) { return $round['day'] === $day; });
  }

  // Returns an associative array of operators for the day
  function getOperatorsForDay ($operators, $day) {
    $operatorsForDay = [];
    foreach ( $operators as $operator ) {
      if ( $operator['assignment_details'][$day]['available_times'] ) {
        $op['user_id'] = $operator['user_id'];
        $op['last_name'] = $operator['last_name'];
        $op['first_name'] = $operator['first_name'];
        $op['special_route'] = $operator['special_route'];
        $op['total_weekly_minutes'] = $operator['total_weekly_minutes'];
        $op['available_times'] = $operator['assignment_details'][$day]['available_times'];
        $op['assigned_times'] = $operator['assignment_details'][$day]['assigned_times'];
        $op['minutes_without_30_minute_break'] = $operator['assignment_details'][$day]['minutes_without_30_minute_break'];
        $op['shift_restrictions']['worked_passed_10']['prior_day'] = $operator['assignment_details'][$day]['shift_restrictions']['worked_passed_10']['prior_day'];
        $op['shift_restrictions']['worked_passed_10']['current_day'] = $operator['assignment_details'][$day]['shift_restrictions']['worked_passed_10']['current_day'];
        $op['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] = $operator['assignment_details'][$day]['shift_restrictions']['shift_passed_15_hour_window']['shift_start'];
        $op['total_daily_minutes'] = $operator['assignment_details'][$day]['total_daily_minutes'];
        array_push($operatorsForDay, $op);
      }
    }
    unset($operator);
    return array_values($operatorsForDay);
  }
<<<<<<< HEAD
  $rounds = json_encode($rounds);
  print("\n". $rounds);
}

uasort($sundayOperators, 'sundayOperatorsSort');
populateSchedule($sundayOperators, $rounds);

//add similar functionality for other days of week.

//NOTES and other materials we are using for debugging.
// echo '<pre>';
// print_r($sundayOperators);
// echo '</pre>';
// exit();
?>

=======

  // Populate the week day by day
  function populateWeeks ($conn, &$rounds, &$operators, $sessionStartTimestamp, $sessionEndTimestamp) {
    $week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    foreach ( $week as $index => $day ) {
      $roundsForDay = getRoundsForDay($rounds, $day);
      $operatorsForDay = getOperatorsForDay($operators, $day);
      $session = getSessionDays($index, $sessionStartTimestamp, $sessionEndTimestamp);
      populateSchedule($operatorsForDay, $roundsForDay, $conn, $session);
      asort($operatorsForDay);
      foreach ( $operators as &$operator ) {
        $key = array_search(intval($operator['user_id']), array_column($operatorsForDay, 'user_id'));
        if ( $key !== false ) {
          $operator['total_weekly_minutes'] = $operatorsForDay[$key]['total_weekly_minutes'];
          if ( $operatorsForDay[$key]['shift_restrictions']['worked_passed_10']['current_day'] ) {
            $operator['assignment_details'][next($week)]['shift_restrictions']['worked_passed_10']['prior_day'] = true;
            prev($week);
          }
          $operator['assignment_details'][$day]['available_times'] = $operatorsForDay[$key]['available_times'];
          $operator['assignment_details'][$day]['assigned_times'] = $operatorsForDay[$key]['assigned_times'];
          $operator['assignment_details'][$day]['total_daily_minutes'] = $operatorsForDay[$key]['total_daily_minutes'];
        }
        $operator['assignment_details'][$day]['dates'] = explode(',', $session);
      }
      unset($operator);
    }
    unset($day);
  }

$sessionStartTimestamp = '2019-08-18';
$sessionEndTimestamp = '2019-12-21';


  $rounds = getRoundsForWeek($conn, $sessionStartTimestamp);
  $operators = getOperatorsForWeek($conn);
  populateWeeks($conn, $rounds, $operators, $sessionStartTimestamp, $sessionEndTimestamp);

?>
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
