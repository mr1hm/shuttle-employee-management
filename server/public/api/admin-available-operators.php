<?php
require_once('operator-functions.php');

function validParameters () {
  if ( empty($_GET['date']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['round_time']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['line_bus']) ) {
    throw new Exception('No line/bus supplied');
  }
  return true;
}

global $conn;
if (validParameters()) {
  ob_start();
  $date = $_GET['date'];
  $shift = json_decode($_GET['round_time'], true);
  $line_bus = $_GET['line_bus'];
  $shift[0]['line_name'] = preg_filter('/\d/', '', $line_bus);

  $query = "SELECT `id` AS 'user_id'
            FROM `user`
            WHERE `role` = 'operator' AND `status` = 'active'";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }

  $operators = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $operators[] = getOperator($row['user_id'], $date);
  }
  foreach ($operators as &$operator) {
    $unavailable = canTakeShift($operator, $shift, $conn, 1);
    $operator['available'] = !$unavailable;
    $operator['unavailable_reasons'] = $unavailable ?? null;
  }
  unset($operator);
  ob_clean();
  print(json_encode($operators));
}

?>
