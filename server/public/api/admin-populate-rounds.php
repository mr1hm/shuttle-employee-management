<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

//**FUNCTIONS**/
function getRoundsData($conn, $quarterStartTimestamp) {
  //TODO: EVENTUALLY REMOVE us.last_name and us.last_name - only for physcial print out/debugging not for db

  $templateDates = [];
  $timestamp = $quarterStartTimestamp;

  for ($day = 0; $day < 7; $day++) {
    $templateDates[] = $timestamp;
    $timestamp = strtotime('+1 days', $timestamp);
  }

  $templateDatesCSV = implode(',', $templateDates);

  $roundsQuery = "SELECT 
                  rd.id,
                  rt.line_name, 
                  bi.bus_number, 
                  rd.start_time AS round_start, 
                  rd.end_time AS round_end,
                  us.id AS user_id, 
                  us.last_name, 
                  us.first_name,
                  rd.date,
                  rd.status
                  FROM route AS rt 
                  JOIN bus_info AS bi ON bi.route_id = rt.id 
                  JOIN round AS rd ON rd.bus_info_id = bi.id 
                  JOIN user AS us ON rd.user_id = us.id
                  WHERE rd.session_id = 1 AND rd.date IN ({$templateDatesCSV})
                  ORDER BY date ASC,line_name ASC, bus_number ASC, round_start ASC, round_end ASC";
          
  $result = mysqli_query($conn, $roundsQuery);
  if(!$result){
    throw new Exception('MySQL error: '.mysqli_error($conn));
  }
  $rounds = [];
  while ($row = mysqli_fetch_assoc($result)) {
    // print("row date: ".$row['date']);
    $row['day'] = date('D', $row['date']);
    // print($row['day']) ;
    // $row['day'] = "Mon";
    // $row['day'] = strptime($row['date'], '%a');
    $rounds[] = $row;
  }
  return $rounds;
}

function getOperatorsData($conn) {
  $operatorsUserDetailsQuery = "SELECT 
                                id AS user_id, 
                                last_name, 
                                first_name,
                                special_route_ok
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
    'continuous_minutes_assigned'=>0,
    'total_daily_minutes'=>0
  ];

  while ($row = mysqli_fetch_assoc($resultOperatorsUserDetailsQuery)) {
    $row['total_weekly_minutes'] = 0;
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
  // print("fetched user id");
  // print_r($fetchedUserIDs);
  $operatorCSV = implode(',', $fetchedUserIDs);
  // print ("operatorCSV".$operatorCSV);

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

  //grouped availabilty array
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
  return $operators;
}

//group all array items with the same key
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

//sorts based on total weekly hours
function operatorsSort($a, $b) {
  if ($a['total_weekly_minutes'] == $b['total_weekly_minutes']) {
      return 0;
  } else {
    return ($a['total_weekly_minutes'] < $b ['total_weekly_minutes']) ? -1 : 1;
  }
}

//returns and array of operators that are available for one day (Sun, Mon, Tue, etc.)
function buildOperatorsByDay($operators, $day) {
  $dayOperators = [];
  
  for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
    if(count($operators[$operatorsIndex]['assignment_details'][$day]['available_times'])) {
      $content['user_id'] = $operators[$operatorsIndex]['user_id'];
      $content['last_name'] = $operators[$operatorsIndex]['last_name'];
      $content['first_name'] = $operators[$operatorsIndex]['first_name'];
      $content['special_route'] = $operators[$operatorsIndex]['special_route_ok'];
      $content['total_weekly_minutes'] = $operators[$operatorsIndex]['total_weekly_minutes'];
      $content['available_times'] = $operators[$operatorsIndex]['assignment_details'][$day]['available_times'];
      $content['times_assigned'] = $operators[$operatorsIndex]['assignment_details'][$day]['times_assigned'];
      $content['continuous_minutes_assigned'] = $operators[$operatorsIndex]['assignment_details'][$day]['continuous_minutes_assigned'];
      $content['total_daily_minutes'] = $operators[$operatorsIndex]['assignment_details'][$day]['total_daily_minutes'];
      array_push($dayOperators, $content);
    }
  }
  uasort($dayOperators, 'operatorsSort');
  $dayOperators = array_values($dayOperators);
  return $dayOperators;
}

function buildRoundsByDay($rounds, $day) {
  $dayRounds = [];
  
  for($roundsIndex = 0; $roundsIndex < count($rounds); $roundsIndex++) {
    if($rounds[$roundsIndex]['day'] === $day) {
      array_push($dayRounds, $rounds[$roundsIndex]);
    }
  }
  // echo '<pre>';
  // print_r($dayRounds);
  // echo '</pre>';
  return $dayRounds;
}

//takes start and end time and calculates total
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

//determine the line name
function determineNumberShiftRounds($lineName){
  $shiftLength = [
    'C'=>3, 
    'D'=>4, 
    'Hs'=>5
  ];
  return $shiftLength[$lineName];
}

//send assigned shift information to db
function updateRoundsInDatabase($conn, $rounds) {
  // print('inside updateRounds function');
  for( $rowIndex=0; $rowIndex < count($rounds); $rowIndex++ ){
    $userId = $rounds[$rowIndex]['user_id'];
    $roundsId = $rounds[$rowIndex]['id'];
    $roundsStatus = $rounds[$rowIndex]['status'];

    if($roundsStatus === 'scheduled') {
      // echo '<pre>';
      // print('round id: '.$roundsId. " user id: ".$userId);
      // echo '</pre>';
      $updateQuery = "UPDATE round 
                      SET user_id = $userId,
                          status = 'scheduled'    
                      WHERE id = $roundsId";

      $result = mysqli_query($conn, $updateQuery);
      if(!$result){
        throw new Exception('MySQL error: '.mysqli_error($conn));
      }
    }
  }
}

//add assigned shifts to the time assigned array for the operator
function addAssignedTime ($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds) {
  $lengthAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);
  $assignedTimeIndex = 0;
  do {
    if(empty($operators[$operatorsIndex]['times_assigned'])) {
      ('Inside EMPTY conditional');
      array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
      break;
    } if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]) === 
        intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
      $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0] = intval($rounds[$roundsIndex]['round_start']);
      print('FIRST CONDITIONAL - after assignment');
      echo '<pre>';
      print_r($operators[$operatorsIndex]['times_assigned']);
      echo '</pre>';
      break;
    } if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1]) === intval($rounds[$roundsIndex]['round_start'])) {
      $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
      print('SECOND CONDITIONAL - after assignment');
      echo '<pre>';
      print_r($operators[$operatorsIndex]['times_assigned']);
      echo '</pre>';
      break;
    } else {
      if ($assignedTimeIndex === $lengthAssignedTimesArray - 1) {
        array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
        print('THIRD CONDITIONAL - after assignment');
        echo '<pre>';
        print_r($operators[$operatorsIndex]['times_assigned']);
        echo '</pre>';
      }
    }
    $assignedTimeIndex++;
  } while ($assignedTimeIndex < $lengthAssignedTimesArray);
  return $operators;
}

function adjustAvailableTimes($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds, $availableStartTime, $availableEndTime, $timesIndex) {
  //shift is exactly the same as the available time
  if($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    // print('time the SAME - before');
    // echo '<pre>';
    // print_r($operators);
    // echo '</pre>';
    array_splice($operators[$operatorsIndex]['available_times'], $timesIndex, 1);
    // echo '<pre>';
    // print('time the SAME - after');
    // print_r($operators);
    // echo '</pre>';
  }
  //shift has same beginning as available time
  else if ($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    // echo '<pre>';
    // print('time at BEGINNING- before');
    // print_r($operators);
    // echo '</pre>';
    $operators[$operatorsIndex]['available_times'][$timesIndex][0] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
    // echo '<pre>';
    // print('time at BEGINNING - after');
    // print_r($operators);
    // echo '</pre>';
  }
  //shift has same end as available time
  else if ($availableStartTime < intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    // echo '<pre>';
    // print('time at END - before');
    // print_r($operators);
    // echo '</pre>';
    $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
    // echo '<pre>';
    // print('time at END - after');
    // print_r($operators);
    // echo '</pre>';
  }
  //shift in middle of available time
  else if ($availableStartTime <  intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])){
    // echo '<pre>';
    // print('time in BETWEEN - before');
    // print_r($operators);
    // echo '</pre>';
    $newAvailableTimeArray = [intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']), $operators[$operatorsIndex]['available_times'][$timesIndex][1]];
    $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
    array_push($operators[$operatorsIndex]['available_times'], $newAvailableTimeArray);
    // echo '<pre>';
    // print('time in BETWEEN - after');
    // print_r($operators);
    // echo '</pre>';
  }
  return $operators;
}

function checkContinuousHourBlock($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds) {
  $blockTooBig = false;
  $operators = addAssignedTime($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);
  $lengthAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);
  for ($assignedTimeIndex = 0; $assignedTimeIndex < $lengthAssignedTimesArray; $assignedTimeIndex++) {
    $blockTime = intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1])- intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]);
    if ($blockTime >= 300) {
      $blockTooBig = true;
      break;
    }
  }
  return $blockTooBig;
}

//auto-populate the schedule
function populateSchedule($operators, $rounds, $conn)  {
  // echo '<pre>';
  // print('inside populate schedule: ');
  // print_r($rounds);
  // echo '</pre>';

  $lengthOperatorsArray = count($operators);
  $lengthRoundsArray = count($rounds);
  for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray ; $roundsIndex++) {
   //determine the line and assign number of rounds to that line
    $lineName = $rounds[$roundsIndex]['line_name'];
    $numberRounds = determineNumberShiftRounds($lineName);

    if ($roundsIndex >= $lengthRoundsArray  - 1 - $numberRounds) {
      break;
    } 
    $madeAssignment = false;
    $specialStatusRequired = false;
    
    //sort the operator array, put operator with fewest weekly hours at the top
    uasort($operators, 'operatorsSort'); 
    $operators = array_values($operators);

    //set the unassigned rounds, rounds on an available line, and rounds on specific bus to 0.
    $unassignedRoundsAvailable = 0;
    $roundsOnLineAvailable = 0;
    $roundsOnBusAvailable = 0;

    //count the number of unassigned rounds
    for ($roundOfShift = 0; $roundOfShift < $numberRounds; $roundOfShift++){
      if ($rounds[$roundsIndex + $roundOfShift]['user_id'] === '1') {
        $unassignedRoundsAvailable++;
      }
    }
    //count the number the number of rounds on the same line
    for ($roundOfShift1 = 0; $roundOfShift1 < $numberRounds; $roundOfShift1++){
      if($rounds[$roundsIndex + $roundOfShift1]['line_name'] === $rounds[$roundsIndex +$roundOfShift1 +1] ['line_name']) {
        $roundsOnLineAvailable++;
      }
    }
    //count the number the number of rounds on the same bus number
    for ($roundOfShift2 = 0; $roundOfShift2 < $numberRounds; $roundOfShift2++){
      if($rounds[$roundsIndex + $roundOfShift2]['bus_number'] === $rounds[$roundsIndex +$roundOfShift1 +1] ['bus_number']) {
        $roundsOnBusAvailable++;
      }
    }

    //Are there adequate unassigned rounds, rounds on the same line, rounds on the same bus?
    if ($unassignedRoundsAvailable === $numberRounds and $roundsOnLineAvailable === $numberRounds and $roundsOnBusAvailable === $numberRounds) {
      // echo '<pre>';
      // print('line name:' . $rounds[$roundsIndex]['line_name']);
      // echo '</pre>';

      // echo '<pre>';
      // print('number of rounds:' . $numberRounds);
      // echo '</pre>';

      // echo '<pre>';
      // print('round start');
      // echo '</pre>';
      // echo '<pre>';
      // print_r($rounds[$roundsIndex]['round_start']);
      // echo '</pre>';
      // echo '<pre>';
      // print('round end:');
      // echo '</pre>';
      // echo '<pre>';
      // print_r($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
      // echo '</pre>';

      //length of the operator array
      $lengthOperatorsArray = count($operators);
      
      //yes, iterate through each operator
      for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {

        //Is the operator able to drive this line?
        //check line type, designate special status if it is required
        $nameOfLine = $rounds[$roundsIndex]['line_name'];
        // if ($nameOfLine = 'C') {
          if ($nameOfLine = 'H') {
          $specialStatusRequired = false;
        }
        if ($specialStatusRequired) {
          //if operator does not have special status go to next operator
          if ($operators[$operatorsIndex]['special_route'] === '0'|| $operators[$operatorsIndex]['special_route'] === 0) {
            continue;
          }
        }

        //if operator will exceed 8 hours (480 minutes), skip that operator
        $totalShiftTime = calculateShiftHours(intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
        if (intval($operators[$operatorsIndex]['total_daily_minutes']) + $totalShiftTime > 480) {
          continue;
        }
        //if the total weekly minutes exceeds 29 hours (1740 minutes), skip that operator
        if (intval($operators[$operatorsIndex]['total_weekly_minutes']) + $totalShiftTime > 1740) {
          continue;
        }

        // Check to see if the operator will have too many hours if the shift is added. If so, skip that operator
        $blockTooBig = checkContinuousHourBlock($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);
        if ($blockTooBig) {
          continue;
        }

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
            // echo'<pre>';
            // print('available start time: '. $availableStartTime . '  available end time: '. $availableEndTime);
            // echo'</pre>'; 

            //yes, update the rounds in the schedule
            for ($roundOfShift = 0; $roundOfShift < $numberRounds; $roundOfShift++) {
              $rounds[$roundsIndex + $roundOfShift]['user_id'] = $operators[$operatorsIndex]['user_id'];
              //TODO:EVENTUALLY REMOVE LINES 348 and 349 - only for physcial print out/debugging not for db
              $rounds[$roundsIndex + $roundOfShift]['last_name'] = $operators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $roundOfShift]['first_name'] = $operators[$operatorsIndex]['first_name'];
              $rounds[$roundsIndex + $roundOfShift]['status'] = 'scheduled';
            }
            //yes, adjust total daily and weekly hours
            $totalShiftTime = calculateShiftHours(intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
            $operators[$operatorsIndex]['total_weekly_minutes'] = intval($operators[$operatorsIndex]['total_weekly_minutes']) + $totalShiftTime;
            $operators[$operatorsIndex]['total_daily_minutes'] = intval($operators[$operatorsIndex]['total_daily_minutes']) + $totalShiftTime;

            //yes, a shift assignement was made
            $madeAssignment = true;

            //yes, add the time added to assigned times for the operator
            $operators = addAssignedTime ($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);

            //yes, adjust available times
            $operators = adjustAvailableTimes ($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds, $availableStartTime, $availableEndTime, $timesIndex);
          }
        }
        if ($madeAssignment) {
          break;
        }
      }
    }
  }
  updateRoundsInDatabase($conn, $rounds);
  $rounds = json_encode($rounds);
  print("\n". $rounds);
  return $operators;
}


function populateTemplateWeek ($conn, $rounds, $operators) {
  $dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for ($dayOfWeekIndex = 0; $dayOfWeekIndex < 7; $dayOfWeekIndex++) {
    $specificDayOfWeek = $dayOfWeek[$dayOfWeekIndex];
    // echo '<pre>';
    // print('specific day of week: '. $specificDayOfWeek);
    // echo '</pre>';
    $roundsForDay = buildRoundsByDay($rounds, $specificDayOfWeek);
    $operatorsForDay = buildOperatorsByDay($operators, $specificDayOfWeek);
    $revOperatorsSpecificDay = populateSchedule($operatorsForDay, $roundsForDay, $conn); 
    for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
      for ($revOperatorsSpecificDayIndex = 0; $revOperatorsSpecificDayIndex < count($revOperatorsSpecificDay); $revOperatorsSpecificDayIndex++) {
        if ($revOperatorsSpecificDay[$revOperatorsSpecificDayIndex]['user_id'] === $operators[$operatorsIndex]['user_id']) {
        $operators[$operatorsIndex]['total_weekly_minutes'] = $revOperatorsSpecificDay[$revOperatorsSpecificDayIndex]['total_weekly_minutes'];
        }
      }
    }
    // echo '<pre>';
    // print('operators after updated with total weekly minutes from day of week population: ');
    // print_r($operators);
    // echo '</pre>';
  }
}

//**PROCESSING**/
$quarterStartTimestamp = 1566100800;
$quarterEndTimestamp = 1576904400;
$beginningOfWeekTimeStamp = $quarterStartTimestamp;
// while ($beginningOfWeekTimeStamp < $quarterEndTimestamp ) {
  $rounds = [];
  $operators = [];
  $rounds = getRoundsData($conn, $beginningOfWeekTimeStamp);
  $operators = getOperatorsData($conn);
  populateTemplateWeek($conn, $rounds, $operators);
  // print('$beginningOfWeekTimeStamp'.$beginningOfWeekTimeStamp);
  $beginningOfWeekTimeStamp = strtotime('+7 days', $beginningOfWeekTimeStamp);
// }

//COPIES WITH PRINT Rs
// function addAssignedTime ($operators, $rounds, $operatorsIndex) {
//   $lengthAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);
//   $assignedTimeIndex = 0;
//   // print('Assigned - BEFORE');
//   // echo '<pre>';
//   // print_r($operators[$operatorsIndex]['times_assigned']);
//   // echo '</pre>';

//   // echo '<pre>';
//   // print ('BEFORE Round start: ' . intval($rounds[$roundsIndex]['round_start']));
//   // echo '</pre>';
//   // echo '<pre>';
//   // print ('BEFORE Round end: ' . intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
//   // echo '</pre>';

//   do {
//     // if ($operators[$operatorsIndex]['times_assigned']) {
//     //   echo '<pre>';
//     //   print ('Line: ' . $rounds[$roundsIndex]['line_name']);
//     //   echo '</pre>';
//     //   echo '<pre>';
//     //   print ('Contents of operators array times assigned at 0: ' . $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]);
//     //   echo '</pre>';
//     //   echo '<pre>';
//     //   print ('Contents of operators array times assigned at 1: ' . $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1]);
//     //   echo '</pre>';
//     //   echo '<pre>';
//     //   print ('Round start: ' . intval($rounds[$roundsIndex]['round_start']));
//     //   echo '</pre>';
//     //   echo '<pre>';
//     //   print ('Round end: ' . intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
//     //   echo '</pre>';
//     // }
//     if(empty($operators[$operatorsIndex]['times_assigned'])) {
//       ('Inside EMPTY conditional');
//       array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
//       break;
//     } if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]) === 
//         intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
//       $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0] = intval($rounds[$roundsIndex]['round_start']);
//       print('FIRST CONDITIONAL - after assignment');
//       echo '<pre>';
//       print_r($operators[$operatorsIndex]['times_assigned']);
//       echo '</pre>';
//       break;
//     } if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1]) === intval($rounds[$roundsIndex]['round_start'])) {
//       $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
//       print('SECOND CONDITIONAL - after assignment');
//       echo '<pre>';
//       print_r($operators[$operatorsIndex]['times_assigned']);
//       echo '</pre>';
//       break;
//     } else {
//       if ($assignedTimeIndex === $lengthAssignedTimesArray - 1) {
//         array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
//         print('THIRD CONDITIONAL - after assignment');
//         echo '<pre>';
//         print_r($operators[$operatorsIndex]['times_assigned']);
//         echo '</pre>';
//       }
//     }
//     $assignedTimeIndex++;
//   } while ($assignedTimeIndex < $lengthAssignedTimesArray);
// }

        // $lenAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);
        // $continuousBlockTooLong = false;
        // for ($assignedIndex = 0; $assignedIndex < $lenAssignedTimesArray; $assignedIndex++) {
        //   $totalContBlockTime = 0;
        //   //shift is attached to either beginning or end (or both) of an assigned shift
        //   if (intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][0]) === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']) || intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][1]) === intval($rounds[$roundsIndex]['round_start'])) {
        //     //there is another element in array beyond this one
        //     if($assignedIndex + 1 < $lenAssignedTimesArray) {
        //       //shift EXACTLY between two assigned shifts
        //       if (intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][1]) === intval($rounds[$roundsIndex]['round_start']) and intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex + 1][0]) === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
        //         $firstBlock = intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][1]) - intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][0]);
        //         $secondBlock = intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex + 1][1]) - intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex + 1][0]);
        //         $totalContBlockTime = $totalShiftTime + $firstBlock + $secondBlock;
        //         if($totalContBlockTime >= 300) {
        //           $continuousBlockTooLong = true;
        //         }
        //       //attached to only one assigned shift
        //       } else {
        //         $existingBlock = intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][1]) - intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][0]);
        //         $totalContBlockTime = $totalShiftTime + $existingBlock;

        //         if($totalContBlockTime >= 300) {
        //           $continuousBlockTooLong = true;
        //         }
        //       }
        //     //only there is not an element beyond this one
        //     } else {
        //         $existingBlock = intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][1]) - intval($operators[$operatorsIndex]['times_assigned'][$assignedIndex][0]);
        //         $totalContBlockTime = $totalShiftTime + $existingBlock;

        //         if($totalContBlockTime >= 300) {
        //           $continuousBlockTooLong = true;
        //           break;
        //         }
        //     }
        //   //shift is not attached to an existing assigned shift
        //   } else {
        //     $totalContBlockTime = $totalShiftTime;               
        //     if($totalContBlockTime >= 300) {
        //       $continuousBlockTooLong = true;
        //       break;
        //     }
        //   }
        // }

        // if ($continuousBlockTooLong) {
        //   continue;
        // }

?>