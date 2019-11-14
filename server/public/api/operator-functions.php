<?php

function updateShiftFlags(&$operator, $shift) {
  if (intval($operator['minutes_without_30_minute_break']) >= 300) {
    $operator['minutes_without_30_minute_break'] -= 300;
  }
  if (intval(end($shift)['round_end']) > 2200) {
    $operator['shift_restrictions']['worked_passed_10']['current_day'] = true;
  }
  if (intval($operator['assigned_times'][0][0]) < 800) {
    $operator['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] = intval($operator['assigned_times'][0][0]);
  }
}

/* Update operators times_assigned associative array with shift times
   * Update operators times_available associative array
   * Update operators daily & weekly minutes */
function assignShiftToOperator(&$operator, $shift) {
  updateOperatorAssignedTimes($operator, $shift);
  updateOperatorAvailableTimes($operator, $shift);

  $shiftTime = calculateShiftMinutes(intval(reset($shift)['round_start']), intval(end($shift)['round_end']));
  $operator['minutes_without_30_minute_break'] += $shiftTime;
  $operator['total_daily_minutes'] += $shiftTime;
  $operator['total_weekly_minutes'] += $shiftTime;
}

function updateOperatorAssignedTimes(&$operator, $shift) {
  $shiftStart = intval(reset($shift)['round_start']);
  $shiftEnd = intval(end($shift)['round_end']);
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
      array_splice($operator['assigned_times'], $key, 1, [[$shiftStart, $shiftEnd]]);
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

  // if ($operator['user_id'] == 10) {
  //   print('<pre>');
  //   print('before');
  //   print_r($operator);
  //   // print_r($shift);
  // }

  // Remove availability if it is the same as the shift
  $key = array_search($shift, array_column($operator, 'available_times'));
  if ($key !== false) {
    array_splice($operator['available_times'], $key, 1);
    return;
  }

  $shiftStart = intval(reset($shift)['round_start']);
  $shiftEnd = intval(end($shift)['round_end']);
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

  // if ($operator['user_id'] == 10) {
  //   print('<pre>');
  //   print('after');
  //   print_r($operator);
  //   // print_r($shift);
  // }

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
