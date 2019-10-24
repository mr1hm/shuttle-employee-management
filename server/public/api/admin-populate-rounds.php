<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
require_once('shift-restrictions.php');

function populateSchedule(&$operators, $rounds, $conn) {
  // Traverse through all rounds
  while ( current($rounds) ) {
    $shift = getShift(current($rounds)['line_name'], $rounds);
    if (key($rounds) >= count($rounds) - count($shift)) break;
    $madeAssignment = false;

    if ( hasAdequateRounds($shift) ) {
      print('good');
      uasort($operators, 'operatorSort');
      // Traverse operators
      foreach ( $operators as &$operator ) {
        if ( canTakeShift($operator, $shift) ) {
          assignShiftToOperator($operator, $shift);
          assignOperatorToShift($operator, $shift);

          $madeAssignment = true;
          break;
        }
      }
      unset($operator);
    } else {
      print('<pre>');
      print_r($shift);
      print('<pre>');
    }

    if ($madeAssignment) {
      updateDatabase($conn, $shift);
    }
    next($rounds);
  }
}

/* Returns an associative array containing all of the rounds to be
 * assigned in a shift */
function getShift($lineName, &$rounds) {
  $lineRounds = [
    'C' => 3,
    'D' => 4,
    'Hs' => 5,
    'S' => 5
  ];
  $minimumRoundsInShift = $lineRounds[$lineName];

  $shift = [];
  for ($i = 0; $i < $minimumRoundsInShift; ++$i) {
    $shift[] = current($rounds);
    if ($i !== $minimumRoundsInShift - 1) next($rounds);
  }

  return $shift;
}

/* Make sure:
 * - All of the rounds in this shift are unassigned to start with
 * - All of the rounds in this shift are on the same line
 * - All of the rounds in this shift are on the same bus */
function hasAdequateRounds($shift) {
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

function assignShiftToOperator(&$operator, $shift) {
  // TODO:
  // Update operators times_assigned associative array with shift times
  // Update operators times_available associative array
  updateOperatorTimes($operator, $shift);
  // updateOperatorTimes($operator, $shift);

  // Update operators daily & weekly minutes
  $shiftTime = calculateShiftMinutes(reset($shift)['round_start'], end($shift)['round_end']);
  $operator['total_daily_minutes'] += $shiftTime;
  $operator['total_weekly_minutes'] += $shiftTime;
}

function updateOperatorTimes (&$operator, $shift) {
  $shiftStart = intval(reset($shift)['round_start']);
  $shiftEnd = intval(end($shift)['round_end']);

  if (empty($operator['assigned_times'])) {
    array_push($operator, [$shiftStart, $shiftEnd]);
  } else {
    // $previousKey = null;
    // foreach ($operator['assigned_times'] as $key => &$timeBlock) {

    // }
    unset($timeBlock);
  }
}


// Update each round in the shift with the operators information
function assignOperatorToShift($operator, &$shift) {
  foreach ( $shift as &$round ) {
    $round['user_id'] = $operator['user_id'];
    $round['last_name'] = $operator['last_name'];
    $round['first_name'] = $operator['first_name'];
    $round['status'] = 'scheduled';
  }
  unset($round);

}

// Update all of the rounds in this shift in the database
function updateDatabase($conn, $shift) {
  while (current($shift)) {
    $user_id = current($shift)['user_id'];
    $id = current($shift)['id'];

    $query = "UPDATE `round`
              SET `user_id` = {$user_id},
                  `status` = 'scheduled'
              WHERE `id` = {$id}";
    $result = mysqli_query($conn, $query);
    if (!$result) {
      throw new Exception('MySQL error: ' . mysqli_error($conn));
    }
    next($shift);
  }
}

// Sort operators so that they are in order by the operator that has the least amount of weekly minutes
function operatorSort($a, $b) {
  if (intval($a['total_weekly_minutes']) === intval($b['total_weekly_minutes'])) {
    return 0;
  } else {
    return (intval($a['total_weekly_minutes']) < intval($b['total_weekly_minutes'])) ? -1 : 1;
  }
}

// Returns an associative array of rounds for the week
function getRoundsForWeek ($conn, $sessionTimestamp) {
  //TODO: EVENTUALLY REMOVE us.last_name and us.last_name - only for physcial print out/debugging not for db
  $weekdays = '';
  for ($day = 0; $day < 7; ++$day) {
    $weekdays .= $sessionTimestamp;
    if ( $day !== 6 ) $weekdays .= ',';
    $sessionTimestamp = strtotime('+1 day', $sessionTimestamp);
  }

  $query = "SELECT `rd`.`id`, `rt`.`line_name`, `bi`.`bus_number`, `rd`.`start_time` AS 'round_start', `rd`.`end_time` AS 'round_end',
                    `us`.`id` AS 'user_id', `us`.`last_name`, `us`.`first_name`, `rd`.`date`, `rd`.`status`
            FROM `route` AS `rt`
            JOIN `bus_info` AS bi ON `bi`.`route_id` = `rt`.`id`
            JOIN `round` AS rd ON `rd`.`bus_info_id` = `bi`.`id`
            JOIN `user` AS us ON `rd`.`user_id` = `us`.`id`
            WHERE `rd`.`session_id` = 1 AND `rd`.`date` IN ({$weekdays})
            ORDER BY date ASC, line_name ASC, bus_number ASC, round_start ASC, round_end ASC";

  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }

  $rounds = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $row['day'] = date('D', $row['date']);
    $rounds[] = $row;
  }

  return $rounds;
}

// Returns an associative array of operators for the week
function getOperatorsForWeek ($conn) {
  $query = "SELECT `id` AS user_id, `last_name`, `first_name`, `special_route_ok`
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
      'worked_passed_10' => ['prior_day' => 0, 'current_day' => 0],
      'shift_passed_15_hour_window' => ['shift_start' => 0]
    ],
    'continuous_minutes_worked' => 0,
    'total_daily_minutes' => 0
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
  // Remove trailing comma
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
function getOperatorsForDay($operators, $day) {
  $operatorsForDay = [];
  foreach ( $operators as $operator ) {
    if ( $operator['assignment_details'][$day]['available_times'] ) {
      $op['user_id'] = $operator['user_id'];
      $op['last_name'] = $operator['last_name'];
      $op['first_name'] = $operator['first_name'];
      $op['special_route'] = $operator['special_route_ok'];
      $op['total_weekly_minutes'] = $operator['total_weekly_minutes'];
      $op['available_times'] = $operator['assignment_details'][$day]['available_times'];
      $op['assigned_times'] = $operator['assignment_details'][$day]['assigned_times'];
      $op['continuous_minutes_worked'] = $operator['assignment_details'][$day]['continuous_minutes_worked'];
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

// Populate the week day by day
function populateWeek ($conn, $rounds, $operators) {
  // $week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // foreach ( $week as $day ) {
    $roundsForDay = getRoundsForDay($rounds, 'Sun');
    $operatorsForDay = getOperatorsForDay($operators, 'Sun');
    populateSchedule($operatorsForDay, $roundsForDay, $conn);
    foreach ( $operators as &$operator ) {
      $key = array_search(intval($operator['user_id']), array_column($operatorsForDay, 'user_id'));
      if ( $key !== false ) {
        $operator['total_weekly_minutes'] = $operatorsForDay[$key]['total_weekly_minutes'];
        if ( intval($operatorsForDay[$key]['shift_restrictions']['worked_passed_10']['current_day']) === 1 ) {
          $operator[$key]['shift_restrictions']['worked_passed_10']['prior_day'] = 1;
        }
      }
    }
    unset($operator);
  // }
  // unset($day);
}

//////////

$sessionStartTimestamp = 1566100800;
$sessionEndTimestamp = 1576904400;
//populate the entire quarter week by week
// while ( $sessionStartTimestamp < $sessionEndTimestamp ) {
  $rounds = getRoundsForWeek($conn, $sessionStartTimestamp);
  $operators = getOperatorsForWeek($conn);

  populateWeek($conn, $rounds, $operators);
  $sessionStartTimestamp = strtotime('+7 days', $sessionStartTimestamp);
// }
?>
