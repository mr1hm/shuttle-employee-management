<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
require_once('operator-functions.php');

function canTakeShift ($operator, $shift, $conn, int $option = null) {
  /* IF $option is omitted, it is being accessed by auto-populate
   * IF $option is 1, it is being accessed by admin-available/unavailable operators */
  if ( !$option ) {
    if ( !shiftWithinAvailability($operator, $shift) ) return false;
    if ( !hasSpecialStatus($operator, $shift, $conn) ) return false;
    if ( shiftTimeRestriction($operator, $shift) ) return false;
    if ( totalShiftTimeRestriction($operator, $shift) ) return false;
    if ( requireBreak($operator, $shift) ) return false;
    return true;
  }
  if ( $option === 1 ) {
    $unavailableMessages = [];
    $unavailableMessages[] = shiftWithinAvailability($operator, $shift, $option);
    $unavailableMessages[] = hasSpecialStatus($operator, $shift, $conn, $option);
    $unavailableMessages[] = shiftTimeRestriction($operator, $shift, $option);
    $unavailableMessages[] = totalShiftTimeRestriction($operator, $shift, $option);
    $unavailableMessages[] = requireBreak($operator, $shift, $option);

    return array_values(array_filter($unavailableMessages));
  }
}

function shiftWithinAvailability ($operator, $shift, int $option = null) {
  if ( !$option ) {
    foreach ( $operator['available_times'] as $timeBlock ) {
      if ( intval($timeBlock[0]) <= intval(reset($shift)['round_start']) &&
          intval($timeBlock[1]) >= intval(end($shift)['round_end']) ) return true;
    }
    unset($timeBlock);
    return false;
  }
  if ( $option === 1 ) {
    if (!$operator['available_times']) return 'Operator has no availability';
    $validShift = 0;
    foreach ($operator['available_times'] as $timeBlock) {
      foreach ($shift as $round) {
        if ( intval($timeBlock[0]) <= intval($round['round_start']) &&
             intval($timeBlock[1]) >= intval($round['round_end']) ) ++$validShift;
      }
    }
    unset($timeBlock);
    return $validShift === count($shift) ? '' : 'Shift is outside operators availability';
  }
}

function hasSpecialStatus ($operator, $shift, $conn, int $option = null) {
  $query = "SELECT `line_name`
            FROM `route`
            WHERE `specialDriver` = 1 AND
                  `status` = 'active'";
  $result = mysqli_query($conn, $query);
  $lines = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $lines[] = $row;
  }
  if (!$option) {
    return array_search(current($shift)['line_name'], $lines) !== null
            ? intval($operator['special_route']) === 1
            : true;
  }
  if ( $option === 1 ) {
    return array_search(reset($shift)['line_name'], $lines) !== null
      ? $operator['special_route']
        ? '' : 'Operator not authorized for special route'
      : '';
  }
}

/* If the the driver worked past 10 pm the night before and the shift is before 8 am skip the operator
 * If the operator has a shift before 8am, they cannot take a shift that ends later than 9pm */
function shiftTimeRestriction ($operator, $shift, int $option = null) {
  if (!$option) {
    return (
      ( intval(reset($shift)['round_start']) < 800 && $operator['shift_restrictions']['worked_passed_10']['prior_day'] ) ||
      ( intval(end($shift)['round_end']) > 2100 && intval($operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start']) < 800 )
    );
  }
  if ( $option === 1 ) {
    return (
      ( intval(reset($shift)['round_start']) < 800 && $operator['shift_restrictions']['worked_passed_10'])
        ? 'Operator cannot work before 8am if they worked past 10pm the previous night'
        : ( intval(end($shift)['round_end']) > 2100 && intval($operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start']) < 800)
          ? 'Operator cannot work after 9pm if they started working before 8am the same day'
          : ''
    );
  }
}

/* If operator will exceed 8 hours (480 minutes) once the shift is added, skip the operator
 * If the total weekly minutes exceeds 29 hours (1740 minutes) once the shift is added, skip the operator */
function totalShiftTimeRestriction ($operator, $shift, int $option = null) {
  if (!$option) {
    $shiftLength = calculateShiftMinutes(intval(reset($shift)['round_start']), intval(end($shift)['round_end']));
    return (
      intval($operator['total_daily_minutes']) + $shiftLength > 480 ||
      intval($operator['total_weekly_minutes']) + $shiftLength > 1740
    );
  }
  if ( $option === 1 ) {
    $shiftLength = array_reduce($shift, function ($acc, $round) {
                     $acc += calculateShiftMinutes(intval($round['round_start']), intval($round['round_end']));
                     return $acc;
                   }, 0);
    return (
      intval($operator['total_daily_minutes']) + $shiftLength > 480
        ? 'Operators hours will exceed daily maximum'
        : intval($operator['total_weekly_minutes']) + $shiftLength > 1740
            ? 'Operators hours will exceed weekly maximum'
            : ''
    );
  }
}

function requireBreak ($operator, $shift, int $option = null) {
  if (!$option) {
    $shiftLength = calculateShiftMinutes(intval(reset($shift)['round_start']), intval(end($shift)['round_end']));
    $gap = calculateShiftMinutes(intval(end($operator['assigned_times'])[1]), intval(reset($shift)['round_start']));
    return (
      intval($operator['minutes_without_30_minute_break']) + $shiftLength >= 300 && $gap < 30
    );
  }
  if ($option === 1) {
    usort($shift, function ($a, $b) {
      if (intval($a['round_start']) === intval($b['round_start'])) return 0;
      return intval($a['round_start']) < intval($b['round_start']) ? -1 : 1;
    });

    if ( hasOverlappingRounds($shift) ) return 'Operator cannot work overlapping rounds';

    $shift = combineRounds($shift);
    if ( shiftWithinAvailability($operator, $shift, 1) ) return '';

    $shiftLength = array_reduce($shift, function ($acc, $round) {
                      $acc += calculateShiftMinutes(intval($round['round_start']), intval($round['round_end']));
                      return $acc;
                    }, 0);

    $numericIndexedShift = [];
    foreach ($shift as $round) $numericIndexedShift[] = array_values($round);
    unset($round);
    $shift = $numericIndexedShift;

    foreach ( $shift as $round ) editAssignedTimes($operator, $round);
    unset($round);

    $minutes = 0;
    foreach ( $operator['assigned_times'] as $index => $time ) {
      if ( $index === 0 ) {
        $minutes += calculateShiftMinutes(intval($time[0]), intval($time[1]));
      } else if ( calculateShiftMinutes(intval($operator['assigned_times'][$index - 1][1]), intval($time[0])) < 30 ) {
        $minutes += calculateShiftMinutes(intval($time[0]), intval($time[1]));
      } else {
        $minutes = calculateShiftMinutes(intval($time[0]), intval($time[1]));
      }
      if ( $minutes > 300 ) return 'Operator cannot work more than 5 hours without at least a 30 minute break';
    }
    return '';
  }
}

function combineRounds ($shifts) {
  $previousShift = $shifts[0];
  $combinedRounds = [];

  foreach ( $shifts as $index => $shift ) {
    if ( intval($previousShift['round_end']) === intval($shift['round_start']) ) {
      $combinedRounds[$index - 1]['round_start'] = intval($previousShift['round_start']);
      $combinedRounds[$index - 1]['round_end'] = intval($shift['round_end']);
    } else {
      $combinedRounds[] = $shift;
    }
    $previousShift = $combinedRounds[$index];
  }
  unset($shift);
  return $combinedRounds;
}

function hasOverlappingRounds ($shifts) {
  $previousRound = null;
  foreach ( $shifts as $round ) {
    if ( $previousRound )
      if ( intval($previousRound['round_end']) > intval($round['round_start']) ) return true;
    $previousRound = $round;
  }
  return false;
}

// Takes a start and end time, calculates the difference and returns it
function calculateShiftMinutes($startTime, $endTime) {
  $startHourDigits = floor($startTime / 100);
  $startMinuteDigits = $startTime / 100 - $startHourDigits;

  $endHourDigits = floor($endTime / 100);
  $endMinuteDigits = $endTime / 100 - $endHourDigits;

  $startTimeInMinutes = $startHourDigits * 60 + $startMinuteDigits * 100;
  $endTimeInMinutes = $endHourDigits * 60 + $endMinuteDigits * 100;

  $shiftLengthInMinutes = $endTimeInMinutes - $startTimeInMinutes;
  return round($shiftLengthInMinutes);
}

?>
