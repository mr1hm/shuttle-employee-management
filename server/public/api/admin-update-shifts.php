<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$user_id = $data['user_id'];
$rounds = $data['rounds'];

for ($rounds_index = 0; $rounds_index < count($rounds); $rounds_index++){
  $current_round = (int)$rounds[$rounds_index];
  $rounds_string .= "$current_round";
  if($rounds_index < count($rounds) - 1){
    $rounds_string .= ", ";
  }
}
$query = "UPDATE `round`
            SET `user_id` = $user_id, `status` = 'scheduled'
            WHERE `id` IN ($rounds_string)";

$result = mysqli_query($conn, $query);
if(!$result){
  throw new Exception('mysql error: '.mysqli_error($conn));
}

// Get shift info from round id's
$query = "SELECT `date`, `start_time`, `end_time` FROM `round`
          WHERE `id` IN ($rounds_string)";

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error: ' . mysqli_error($conn));
}
$shifts = [];
while ($row = mysqli_fetch_assoc($result)) {
  $shifts[] = $row;
}

if ( $user_id === 1 ) { // Unassign shift(s) from operator in operators table

} else {  // Assign shift(s) to operator in operators table
  print( json_encode($shifts) );
}

/* Update operators times_assigned associative array with shift times
   * Update operators times_available associative array
   * Update operators daily & weekly minutes */
// function assignShiftToOperator(&$operator, $shift)
// {
//   updateOperatorAssignedTimes($operator, $shift);
//   updateOperatorAvailableTimes($operator, $shift);

//   $shiftTime = calculateShiftMinutes(intval(reset($shift)['round_start']), intval(end($shift)['round_end']));
//   $operator['minutes_without_30_minute_break'] += $shiftTime;
//   $operator['total_daily_minutes'] += $shiftTime;
//   $operator['total_weekly_minutes'] += $shiftTime;
// }

// function updateOperatorAssignedTimes(&$operator, $shift)
// {
//   $shiftStart = intval(reset($shift)['round_start']);
//   $shiftEnd = intval(end($shift)['round_end']);
//   $lastIndex = count($operator['assigned_times']) - 1;

//   // Empty assigned times
//   if (empty($operator['assigned_times'])) {
//     array_push($operator['assigned_times'], [$shiftStart, $shiftEnd]);
//     return;
//   }

//   // Insert at beginning
//   if ($shiftEnd <= intval($operator['assigned_times'][0][0])) {
//     array_unshift($operator['assigned_times'], [$shiftStart, $shiftEnd]);
//     if (intval($operator['assigned_times'][0][1]) === intval($operator['assigned_times'][1][0])) {
//       $operator['assigned_times'][0][1] = $operator['assigned_times'][1][1];
//       array_splice($operator['assigned_times'], 1, 1);
//     }
//     return;
//   }
//   // Insert at end
//   if ($shiftStart >= intval($operator['assigned_times'][$lastIndex][1])) {
//     array_push($operator['assigned_times'], [$shiftStart, $shiftEnd]);
//     $lastIndex = count($operator['assigned_times']) - 1;
//     if (intval($operator['assigned_times'][$lastIndex][0]) === intval($operator['assigned_times'][$lastIndex - 1][1])) {
//       $operator['assigned_times'][$lastIndex - 1][1] = $operator['assigned_times'][$lastIndex][1];
//       array_pop($operator['assigned_times']);
//     }
//     return;
//   }

//   // Insert in between
//   $prevTimeBlock = null;
//   $insertIndex = 0;
//   foreach ($operator['assigned_times'] as $key => &$timeBlock) {
//     if ($prevTimeBlock && ($shiftStart >= $prevTimeBlock[1] && $shiftEnd <= $timeBlock[0])) {
//       array_splice($operator['assigned_times'], $key, 1, [[$shiftStart, $shiftEnd]]);
//       $insertIndex = $key;
//       break;
//     }
//     $prevTimeBlock = $timeBlock;
//   }
//   unset($timeBlock);

//   /* If inserted shift has start/end times that are equivalent to neighboring
//       * shifts - trunctate the shift(s) into a single shift */
//   if (intval($operator['assigned_times'][$insertIndex - 1][1]) === intval($operator['assigned_times'][$insertIndex][0])) {
//     $operator['assigned_times'][$insertIndex - 1][1] = $operator['assigned_times'][$insertIndex][1];
//     array_splice($operator['assigned_times'], $insertIndex, 1);
//     --$insertIndex;
//   }
//   if (isset($operator['assigned_times'][$insertIndex + 1])) {
//     if (intval($operator['assigned_times'][$insertIndex + 1][0]) === intval($operator['assigned_times'][$insertIndex][1])) {
//       $operator['assigned_times'][$insertIndex + 1][0] = $operator['assigned_times'][$insertIndex][0];
//       array_splice($operator['assigned_times'], $insertIndex, 1);
//     }
//   }
// }

// function updateOperatorAvailableTimes(&$operator, $shift)
// {
//   // Remove availability if it is the same as the shift
//   $key = array_search($shift, array_column($operator, 'available_times'));
//   if ($key !== false) {
//     array_splice($operator['available_times'], $key, 1);
//     return;
//   }

//   $shiftStart = intval(reset($shift)['round_start']);
//   $shiftEnd = intval(end($shift)['round_end']);
//   foreach ($operator['available_times'] as $key => &$timeBlock) {
//     if ($shiftStart === intval($timeBlock[0])) { // Push back start time
//       $timeBlock[0] = $shiftEnd;
//       break;
//     }
//     if ($shiftEnd === intval($timeBlock[1])) { // Push back end time
//       $timeBlock[1] = $shiftStart;
//       break;
//     }
//     // If shift is inside of a time block - Break the time block into 2 blocks
//     if ($shiftStart > intval($timeBlock[0]) && $shiftEnd < intval($timeBlock[1])) {
//       $newBlockEnd = intval($timeBlock[1]);
//       $timeBlock[1] = $shiftStart;
//       array_splice($operator['available_times'], $key + 1, 1, [$key + 1 => [$shiftEnd, $newBlockEnd]]);
//       break;
//     }
//   }
// }

?>
