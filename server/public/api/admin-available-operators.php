<?php

require_once('shift-restrictions.php');

function buildOperators ($conn, $date) {
  $query = "SELECT `operator`
            FROM `quarter_operator_schedule`
            WHERE `date` = {$date}";
  $result = mysqli_query($conn, $query);
  if ( !$result ) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $operators = [];
  while ( $row = mysqli_fetch_assoc($result) ) {
    $operators[] = json_decode($row['operator'],true);
  }
  print('<pre>');
  print_r($operators);
}

buildOperators($conn, 1566100800);

?>
