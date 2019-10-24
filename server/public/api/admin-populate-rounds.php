<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
require_once('shift-restrictions.php');

// Populates the schedule for 1 day
function populateSchedule (&$operators, $rounds, $conn) {
  // Traverse through all rounds
  while ( current($rounds) ) {

    $shift = getShift(current($rounds)['line_name'], $rounds);

    if ( key($rounds) >= count($rounds) - count($shift)) break;

    $madeAssignment = false;

    if ( hasAdequateRounds($shift) ) {
      uasort($operators, 'operatorSort');
      // Traverse operators
      while ( current($operators) ) {
        if ( canTakeShift(current($operators), $shift) ) {

          print('<pre>');
          print('Operator: ');
          print_r(current($operators));
          print('Shift: ');
          print_r($shift);
          print('<pre>');

          assignShiftToOperator(current($operators), $shift);
          assignOperatorToShift(current($operators), $shift);

          // updateDatabase($conn, $shift);
          $madeAssignment = true;
          break;
        }
        next($operators);
      }
      reset($operators);
    }

    if ($madeAssignment) {
      // print('cool');
    }
    next($rounds);
  }

}

/* Returns an associative array containing all of the rounds to be
 * assigned in a shift */
function getShift ($lineName, &$rounds) {
  $lineRounds = [
    'C' => 3,
    'D' => 4,
    'Hs' => 5,
    'S' => 5
  ];
  $minimumRoundsInShift = $lineRounds[$lineName];

  $shift = [];
  for ($i = 0; $i < $minimumRoundsInShift; ++$i) {
    $shift[] = current( $rounds );
    if ($i !== $minimumRoundsInShift - 1) next( $rounds );
  }

  return $shift;
}

/* Make sure:
 * - All of the rounds in this shift are unassigned to start with
 * - All of the rounds in this shift are on the same line
 * - All of the rounds in this shift are on the same bus */
function hasAdequateRounds ($shift) {
  $roundsInShift = count( $shift );

  // Make sure all of the rounds in the shift are unassigned
  for ($i = 0; $i < $roundsInShift; ++$i) {
    if ( intval($shift[$i]['user_id']) !== 1 ) return false;
  }

  // Make sure all of the rounds in the shift are on the same line
  $lineName = $shift[0]['line_name'];
  for ($i = 1; $i < $roundsInShift; ++$i) {
    if ( $shift[$i] !== $lineName ) return false;
  }

  // Make sure all of the rounds in the shift are on the same bus
  $busNumber = intval($shift[0]['bus_number']);
  for ($i = 1; $i < $roundsInShift; ++$i) {
    if (intval($shift[$i]) !== $busNumber) return false;
  }

  return true;
}

function assignShiftToOperator(&$operator, $shift) {
// TODO:
  // Update operators times_assigned associative array with shift times

  // Update operators times_available associative array (formerly called available_times)

  // Update operators daily & weekly minutes

}

function assignOperatorToShift ($operator, &$shift) {
// TODO:
  // Update each round in the shift with the operators information

}

// Update all of the rounds in this shift in the database
function updateDatabase ($conn, $shift) {
  while ( current($shift) ) {
    $user_id = current($shift)['user_id'];
    $id = current($shift)['id'];

    $query = "UPDATE `round`
              SET `user_id` = {$user_id},
                  `status` = 'scheduled'
              WHERE `id` = {$id}";
    $result = mysqli_query($conn, $query);
    if ( !$result ) {
      throw new Exception('MySQL error: ' . mysqli_error($conn));
    }
    next($shift);
  }
}

// Sort operators so that they are in order by the operator that has the least amount of weekly minutes
function operatorSort ($a, $b) {
  if (intval($a['total_weekly_minutes']) === intval($b['total_weekly_minutes'])) {
    return 0;
  } else {
    return (intval($a['total_weekly_minutes']) < intval($b['total_weekly_minutes'])) ? -1 : 1;
  }
}

?>
