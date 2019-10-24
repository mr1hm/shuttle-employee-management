<?php

function canTakeShift ($operator, $shift) {
  if ( !shiftWithinAvailability($operator, $shift) ) return false;
  if ( !hasSpecialStatus($operator, $shift) ) return false;
  if ( shiftTimeRestriction($operator, $shift) ) return false;
  if ( totalShiftTimeRestriction($operator, $shift) ) return false;
  return true;
}

function shiftWithinAvailability ($operator, $shift) {
  foreach ( $operator['available_times'] as $slot ) {
    if ( intval($slot[0]) <= intval(reset($shift)['round_start']) &&
         intval($slot[1]) >= intval(end($shift)['round_end']) ) return true;
  }
  unset($slot);
  return false;
}

function hasSpecialStatus ($operator, $shift) {
  return (current($shift)['line_name'] === 'C')
            ? intval($operator['special_route']) === 1
            : true;
}

/* If the the driver worked past 10 pm the night before and the shift is before 8 am skip the operator
 * If the operator has a shift before 8am, they cannot take a shift that ends later than 9pm */
function shiftTimeRestriction ($operator, $shift) {
  return (
    ( intval(reset($shift)['round_start']) < 800 && intval($operator['shift_restrictions']['worked_passed_10']['prior_day']) === 1 ) ||
    ( intval(end($shift)['round_end']) > 2100 && intval($operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start']) < 800 )
  );
}

/* If operator will exceed 8 hours (480 minutes) once the shift is added, skip the operator
 * If the total weekly minutes exceeds 29 hours (1740 minutes) once the shift is added, skip the operator */
function totalShiftTimeRestriction ($operator, $shift) {
  $shiftLength = calculateShiftMinutes(reset($shift)['round_start'], end($shift)['round_end']);
  return (
    intval($operator['total_daily_minutes']) + $shiftLength > 480 ||
    intval($operator['total_weekly_minutes']) + $shiftLength > 1740
  );

}

function requireBreak ($operator, $shift) {

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
