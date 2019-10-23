<?php

require_once('functions.php');
set_exception_handler('error_handler');

//takes start and end time and calculates total
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

function shiftTimeRestriction($round, $operator) {
  //if the the driver worked past 10 pm the night before and the shift is before 8 am skip the operator
  //if the operator has a shift before 8am, they cannot take a shift that ends later than 9pm
  return ( (intval($round['round_start']) < 800 && $operator['shift_restrictions']['worked_passed_10']['prior_day'] === 1) ||
           (intval($round['round_end']) > 2100 && $operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] < 800) );
}

function totalShiftTimeRestriction($roundStart, $roundEnd, $operator) {
  $totalShiftTime = calculateShiftMinutes(intval($roundStart), intval($roundEnd));
  $totalMinutesInDay = intval($operator['total_daily_minutes']) + $totalShiftTime;
  $totalWeeklyMinutes = intval($operator['total_weekly_minutes']) + $totalShiftTime;
  //if operator will exceed 8 hours (480 minutes) once the shift is added, skip the operator
  //if the total weekly minutes exceeds 29 hours (1740 minutes) once the shift is added, skip the operator
  return ($totalMinutesInDay > 480 || $totalWeeklyMinutes > 1740);
}

function set30MinuteBreakFlag(&$operator) {
  //set the flag for the required 30 minute break after working 5 continuous hours
  $latestShiftIndex = count($operator['times_assigned']) - 1;
  $latestShift = $operator['times_assigned'][$latestShiftIndex];
  if ($latestShift[1] - $latestShift[0] === 500) {
    $operator['shift_restrictions']['30minute_break'] = intval($latestShift[1]);
  }
}

function enforce30MinuteBreak($roundStart, $operator) {
  //Don't assign this round to an operator if the round starts within 30 minutes after the operator worked 5 continuous hours
  return (intval($roundStart) - intval($operator['shift_restrictions']['30minute_break']) < 30);
}

?>
