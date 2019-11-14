<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
require_once('operator-functions.php');

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
$query = "SELECT `date`, `start_time` AS 'round_start', `end_time` AS 'round_end'
          FROM `round`
          WHERE `id` IN ($rounds_string)";

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error: ' . mysqli_error($conn));
}
$shifts = [];
while ($row = mysqli_fetch_assoc($result)) {
  $shifts[] = $row;
}
$date = current($shifts)['date'];

// Get operator info from operator id
$query = "SELECT `operator`
          FROM `operators`
          WHERE `user_id` = $user_id AND `date` = $date";
$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error: ' . mysqli_error($conn));
}
$operator = json_decode(mysqli_fetch_assoc($result)['operator'], true);

if ( $user_id === 1 ) { // Unassign shift(s) from operator in operators table
  // while (current($shifts)) {
  //   unassignShiftFromOperator($operator, current($shifts));
  //   next($shifts);
  // }
} else {  // Assign shift(s) to operator in operators table
  // print( json_encode($operator) );
  // while ( current($shifts) ) {
    // assignShiftToOperator($operator, current($shifts));
    // updateShiftFlags($operator, current($shift));
    // next($shifts);
  // }
  print( json_encode($operator) );
}

?>
