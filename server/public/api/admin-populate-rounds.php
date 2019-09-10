<?php
//NOTE: all the debugging code was left in place as a precautionary measure. 
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$query = "SELECT 
          rt.line_name, 
          bi.bus_number, 
          rd.start_time AS round_start, 
          rd.end_time AS round_end,
          us.id AS user_id, 
          us.last_name, 
          us.first_name,
          rd.date
          FROM route AS rt 
          JOIN bus_info AS bi ON bi.route_id = rt.id 
          JOIN round AS rd ON rd.bus_info_id = bi.id 
          JOIN user AS us ON rd.user_id = us.id
          WHERE rd.session_id = 1";

$result = mysqli_query($conn, $query);
if(!$result){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}
$rounds = [];
while ($row = mysqli_fetch_assoc($result)) {
  $row['day'] = date('D', $row['date']);
  $rounds[] = $row;
}

// echo '<pre>';
// print_r($rounds);
// echo '</pre>';
// exit();

$operatorsUserDetailsQuery = "SELECT 
                              id AS user_id, 
                              last_name, 
                              first_name 
                              FROM user 
                              WHERE role = 'operator' AND status = 'active'";

$resultOperatorsUserDetailsQuery = mysqli_query($conn, $operatorsUserDetailsQuery);
if(!$resultOperatorsUserDetailsQuery){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$operatorsUserDetails = [];
$fetchedUserIDs = [];

$baseDayStructure = [
  'available_times'=>[],
  'times_assigned'=>[],
  'continuous_hours_assigned'=>0,
  'total_daily_hours'=>0
];

while ($row = mysqli_fetch_assoc($resultOperatorsUserDetailsQuery)) {
  $row['total_weekly_hours'] = 0;
  $row['assignment_details']=[
    'Sun'=>$baseDayStructure,
    'Mon'=>$baseDayStructure,
    'Tue'=>$baseDayStructure,
    'Wed'=>$baseDayStructure,
    'Thu'=>$baseDayStructure,
    'Fri'=>$baseDayStructure,
    'Sat'=>$baseDayStructure,
  ];
  $fetchedUserIDs[] = $row['user_id'];
  $operatorsUserDetails[$row['user_id']] = $row;
}

$operatorCSV = implode(',', $fetchedUserIDs);

$operatorAvailabilityQuery = "SELECT 
                              user_id, 
                              day_of_week, 
                              CONCAT(start_time, ' , ', end_time) AS availability 
                              FROM `operator_availability` 
                              WHERE session_id = 1 AND user_id IN ({$operatorCSV})";

$resultAvailabilityQuery = mysqli_query($conn, $operatorAvailabilityQuery);

if(!$resultAvailabilityQuery){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

//array of operator's availabilities
$operatorAvailability = [];

while ($row = mysqli_fetch_assoc($resultAvailabilityQuery)) {
  $operatorAvailability[] = $row;
}

$lengthOperatorAvailability = count($operatorAvailability);

//put all the availability information into arrays (came in as strings)
for ($j = 0; $j < $lengthOperatorAvailability; $j++) {
  $operatorAvailability[$j]['availability'] = explode (',', $operatorAvailability[$j]['availability']);
}

function array_group_by(array $array, $key)
{
  if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key) ) {
    trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);
    return null;
  }
  $func = (!is_string($key) && is_callable($key) ? $key : null);
  $_key = $key;
  // Load the new array, splitting by the target key
  $grouped = [];
  foreach ($array as $value) {
    $key = null;
    if (is_callable($func)) {
      $key = call_user_func($func, $value);
    } elseif (is_object($value) && property_exists($value, $_key)) {
      $key = $value->{$_key};
    } elseif (isset($value[$_key])) {
      $key = $value[$_key];
    }
    if ($key === null) {
      continue;
    }
    $grouped[$key][] = $value;
  }
  // Recursively build a nested grouping if more parameters are supplied
  // Each grouped array value is grouped according to the next sequential key
  if (func_num_args() > 2) {
    $args = func_get_args();
    foreach ($grouped as $key => $value) {
      $params = array_merge([ $value ], array_slice($args, 2, func_num_args()));
      $grouped[$key] = call_user_func_array('array_group_by', $params);
    }
  }
  return $grouped;
}

$groupedAvailabilityArray = array_group_by($operatorAvailability,'user_id');

foreach($groupedAvailabilityArray as $userID=>$userAvailability){
  //for each record that has that user_id
  $userAvailabilityLength = count($userAvailability);
  for ($availabilityIndex = 0; $availabilityIndex < $userAvailabilityLength; $availabilityIndex++) {
    
    $currentDay = $userAvailability[$availabilityIndex]['day_of_week'];
    $operatorsUserDetails[$userID]['assignment_details'][$currentDay]['available_times'][] = $userAvailability[$availabilityIndex]['availability'];
  }
}

$operators =[];

foreach($operatorsUserDetails as $value) {
  $operators[] = $value;
}

// echo '<pre>';
// print_r($operators);
// echo '</pre>';
// exit();


$sundayOperators = [];
for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
  if(count($operators[$operatorsIndex]['assignment_details']['Sun']['available_times'])) {
    $content['user_id'] = $operators[$operatorsIndex]['user_id'];
    $content['last_name'] = $operators[$operatorsIndex]['last_name'];
    $content['first_name'] = $operators[$operatorsIndex]['first_name'];
    $content['total_weekly_hours'] = $operators[$operatorsIndex]['total_weekly_hours'];
    $content['available_times'] = $operators[$operatorsIndex]['assignment_details']['Sun']['available_times'];
    $content['times_assigned'] = $operators[$operatorsIndex]['assignment_details']['Sun']['times_assigned'];
    $content['continuous_hours_assigned'] = $operators[$operatorsIndex]['assignment_details']['Sun']['continuous_hours_assigned'];
    $content['total_daily_hours'] = $operators[$operatorsIndex]['assignment_details']['Sun']['total_daily_hours'];
    array_push($sundayOperators, $content);
  }
}


function sundayOperatorsSort($a, $b) {
  if ($a['total_weekly_hours'] == $b['total_weekly_hours']) {
      return 0;
  } else {
    return ($a['total_weekly_hours'] < $b ['total_weekly_hours']) ? -1 : 1;
  }
}


//NEEDS TO BE CORRECTED FOR PHP
function calculateShiftHours($startTime, $endTime){
  $startHourDigits = floor($startTime/100);
  $startMinuteDigits = $startTime/100 - $startHourDigits;

  $endHourDigits = floor($endTime/100);
  $endMinuteDigits = $endTime/100 - $endHourDigits;

  $startTimeInMinutes = $startHourDigits*60 + $startMinuteDigits*100;
  $endTimeInMinutes = $endHourDigits*60 + $endMinuteDigits*100;

  $shiftLengthInMinutes = $endTimeInMinutes - $startTimeInMinutes;
  return round($shiftLengthInMinutes); 
}

function determineLineName ($lineName){
  $z = null;
  if ($lineName === 'C') {
    $z = 3;
    return $z;
  } if ($lineName === 'D') {
    $z = 4;
    return $z;
  } if ($lineName === 'Hs') {
    $z = 5;
    return $z;
  } if ($lineName === 'N') {
    $z = 3;
    return $z; 
  } if ($lineName === 'S') {
    $z = 4;
    return $z; 
  }
}


function populateSchedule($operators, $rounds)  {
  $lengthOperatorsArray = count($operators);
  $lengthRoundsArray = count($rounds);
  for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray ; $roundsIndex++) {
   //determine the line and assign number of rounds to that line

   $lineName = $rounds[$roundsIndex]['line_name'];
   $numberRounds = determineLineName($lineName);
  //  echo '<pre>';
  //  print('number of rounds in '. $lineName . ': ' . $numberRounds);
  //  echo '</pre>';

    //not enough rounds to assign -- end of the round array
    // $length = $lengthRoundsArray  - 1;
    // print('BREAK CRITERIA - number rounds: '. $numberRounds . ' last index: ' . $length . "current index: " . $roundsIndex . "number rounds necessary: " . $numberRounds);
    if ($roundsIndex >= $lengthRoundsArray  - 1 - $numberRounds) {
      break;
    } 
    $madeAssignment = false;

    //check to make sure we have times available, if not remove that person
    for ($operatorsIndex = $lengthOperatorsArray -1; 0 <=$operatorsIndex; $operatorsIndex--) {
      if (empty ($operators[$operatorsIndex]['available_times'])){
        unset($operators[$operatorsIndex]);
      }
    }
    array_values($operators);
    
    //sort the operator array, put operator with fewest weekly hours at the top
    uasort($operators, 'sundayOperatorsSort'); 
    $operators = array_values($operators);

    $unassignedRoundsAvailable = 0;
    $roundsOnLineAvailable = 0;

    // echo '<pre>';
    // print('roundsIndex:' . $roundsIndex );
    // echo '</pre>';
    //count the number of unassigned rounds
    for ($roundOfShift = 0; $roundOfShift < $numberRounds; $roundOfShift++){
      if ($rounds[$roundsIndex + $roundOfShift]['user_id'] === '1') {
        // echo '<pre>';
        // print('unassignedRoundsAvailable before: '.$unassignedRoundsAvailable);
        // echo '</pre>';
        $unassignedRoundsAvailable++;
        // echo '<pre>';
        // print('unassignedRoundsAvailable after: '.$unassignedRoundsAvailable);
        // echo '</pre>';
      }
    }
    // echo '<pre>';
    // print('roundsIndex:' . $roundsIndex );
    // echo '</pre>';
    //count the number of rounds available on line
    for ($roundOfShift1 = 0; $roundOfShift1 < $numberRounds; $roundOfShift1++){

      if($rounds[$roundsIndex + $roundOfShift1]['line_name'] === $rounds[$roundsIndex +$roundOfShift1 +1] ['line_name']) {
        // echo '<pre>';
        // print('unassignedLines before: '.$roundsOnLineAvailable);
        // echo '</pre>';
        $roundsOnLineAvailable++;
        // echo '<pre>';
        // print('unassignedLines after: '.$roundsOnLineAvailable);
        // echo '</pre>';
      }
    }
    // echo '<pre>';
    // print('roundsIndex:' . $roundsIndex );
    // echo '</pre>';

    // echo '<pre>';
    // print_r($rounds[$roundsIndex]['round_start']);
    // echo '</pre>';
    // $shiftStartTime = intval($rounds[$roundsIndex]['round_start']);
    // $shiftEndTime = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);

    if ($unassignedRoundsAvailable === $numberRounds and $roundsOnLineAvailable === $numberRounds) {
      echo '<pre>';
      print('line name:' . $rounds[$roundsIndex]['line_name']);
      echo '</pre>';

      echo '<pre>';
      print('number of rounds:' . $numberRounds);
      echo '</pre>';

      echo '<pre>';
      print('round start');
      echo '</pre>';
      echo '<pre>';
      print_r($rounds[$roundsIndex]['round_start']);
      echo '</pre>';
      echo '<pre>';
      print('round end:');
      echo '</pre>';
      echo '<pre>';
      print_r($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
      echo '</pre>';

      //specify the length of the operator array
      $lengthOperatorsArray = count($operators);
      
      //iterate through each operator
      for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {

        //array of available time slots for one operator
        $availabilityArray = $operators[$operatorsIndex]['available_times']; 

        //length of the times availability array
        $lengthTimesAvailableArray = count($availabilityArray); 
    
        for ($timesIndex = 0; $timesIndex < $lengthTimesAvailableArray; $timesIndex++) {
  
          //define available start and end times
          $availableStartTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][0]);
          $availableEndTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][1]);

          //Is shift within the available time range of operator?
          if ($availableStartTime <= intval($rounds[$roundsIndex]['round_start']) and $availableEndTime >= intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
            echo'<pre>';
            print('available start time: '. $availableStartTime . '  available end time: '. $availableEndTime);
            echo'</pre>'; 

            //yes, update the rounds in the schedule
            for ($roundOfShift = 0; $roundOfShift < $numberRounds; $roundOfShift++) {
              $rounds[$roundsIndex + $roundOfShift]['user_id'] = $operators[$operatorsIndex]['user_id'];
              $rounds[$roundsIndex + $roundOfShift]['last_name'] = $operators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $roundOfShift]['first_name'] = $operators[$operatorsIndex]['first_name'];
            }
            //yes, adjust total daily and weekly hours

            //right now this is in minutes, needs to be adjusted for hours
            $totalShiftTime = calculateShiftHours(intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));

            //NOTE: We have everything displaying in minutes right now. This needs to be adjusted to hours.

            $operators[$operatorsIndex]['total_weekly_hours'] = intval($operators[$operatorsIndex]['total_weekly_hours']) /60 + $totalShiftTime /60;
            $operators[$operatorsIndex]['total_daily_hours'] = intval($operators[$operatorsIndex]['total_daily_hours']) /60 + $totalShiftTime /60;

            //yes, a shift assignement was made
            $madeAssignment = true;

            // $shiftStartTime = intval($rounds[$roundsIndex]['round_start']);
            // $shiftEndTime = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);

            //yes, add the time added to assigned times for the operator
            array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
            // echo '<pre>';
            // print('time added to assigned time: '. $shiftStartTime . ',' . $shiftEndTime);
            // echo '</pre>';


            //yes, adjust available times
            //shift is exactly the same as the available time
            if($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
              print('time the SAME - before');
              echo '<pre>';
              print_r($operators);
              echo '</pre>';
              array_splice($operators[$operatorsIndex]['available_times'], $timesIndex, 1);
              echo '<pre>';
              print('time the SAME - after');
              print_r($operators);
              echo '</pre>';
              break;
            }
            //shift has same beginning as available time
            if ($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
              echo '<pre>';
              print('time at BEGINNING- before');
              print_r($operators);
              echo '</pre>';
              $operators[$operatorsIndex]['available_times'][$timesIndex][0] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
              echo '<pre>';
              print('time at BEGINNING - after');
              print_r($operators);
              echo '</pre>';
              break;
            }
            //shift has same end as available time
            if ($availableStartTime < intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
              echo '<pre>';
              print('time at END - before');
              print_r($operators);
              echo '</pre>';
              $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
              echo '<pre>';
              print('time at END - after');
              print_r($operators);
              echo '</pre>';
              break;
            }
            //shift in middle of available time
            if ($availableStartTime <  intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])){
              echo '<pre>';
              print('time in BETWEEN - before');
              print_r($operators);
              echo '</pre>';
              $newAvailableTimeArray = [intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']), $operators[$operatorsIndex]['available_times'][$timesIndex][1]];
              $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
              array_push($operators[$operatorsIndex]['available_times'], $newAvailableTimeArray);
              echo '<pre>';
              print('time in BETWEEN - after');
              print_r($operators);
              echo '</pre>';
              break;
            }
          }
        }
        if ($madeAssignment) {
          break;
        }
      }
    }
  }
  $rounds = json_encode($rounds);
  print("\n". $rounds);
}

uasort($sundayOperators, 'sundayOperatorsSort');
$sundayOperators = array_values($sundayOperators);
populateSchedule($sundayOperators, $rounds);
?>