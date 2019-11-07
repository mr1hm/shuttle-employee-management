<?php

require_once('shift-restrictions.php');

function buildOperatorsForDay ($week, $day, $conn) {
  $query = "SELECT `date`, `operator`
            FROM `operators`
            WHERE `date` >= {$week[0]} AND
                  `date` <= {$week[1]}";
  $result = mysqli_query($conn, $query);
  if ( !$result ) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $operators = [];
  while ( $row = mysqli_fetch_assoc($result) ) {
    $operators[] = [
      'day' => date('D', $row['date']),
      'details' => json_decode($row['operator'], true)
    ];
  }

  $operators = array_filter($operators, function ($op) use ($day) {
                 return $op['day'] === $day;
               });

  return $operators;
}

function validParameters () {
  if ( empty($_GET['date']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['sunday']) ) {
    throw new Exception('No beginning of week supplied');
  }
  if ( empty($_GET['saturday']) ) {
    throw new Exception('No end of week supplied');
  }
  if ( empty($_GET['round_time']) ) {
    throw new Exception('No date supplied');
  }
  if ( empty($_GET['line_bus']) ) {
    throw new Exception('No line/bus supplied');
  }
  return true;
}

if ( validParameters() ) {
  $day = date('D', $_GET['date']);
  $week = [ $_GET['sunday'], $_GET['saturday'] ];
  $shift = json_decode($_GET['round_time'], true);
  $line_bus = $_GET['line_bus'];
  $shift[0]['line_name'] = preg_filter('/\d/', '', $line_bus);

  $operators = buildOperatorsForDay($week, $day, $conn);
  foreach ($operators as &$operator) {
    $unavailable = canTakeShift($operator['details'], $shift, $conn, 1);
    $operator['available'] = !$unavailable;
    $operator['unavailable_reasons'] = $unavailable ?? null;
  }
  unset($operator);
  print( json_encode($operators) );
}

?>
