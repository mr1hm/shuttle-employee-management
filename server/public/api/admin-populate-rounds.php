<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$outputStorage = [];

//**FUNCTIONS**/
//pull the rounds for the first week from the db
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
    $row['day'] = date('D', $row['date']);
    $rounds[] = $row;
  }
  return $rounds;
}

//get data on the operators from the db
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
    'shift_restrictions' => [
      '30minute_break' => 0,
      'worked_passed_10' => ['prior_day' => 0, 'current_day' => 0],
      'shift_passed_15_hour_window' => ['shift_start' => 0]
    ],
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

//returns an array of operators that are available for one day (Sun, Mon, Tue, etc.)
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
      $content['shift_restrictions']['30minute_break'] = $operators[$operatorsIndex]['assignment_details'][$day]['shift_restrictions']['30minute_break'];
      $content['shift_restrictions']['worked_passed_10']['prior_day'] = $operators[$operatorsIndex]['assignment_details'][$day]['shift_restrictions']['worked_passed_10']['prior_day'];
      $content['shift_restrictions']['worked_passed_10']['current_day'] = $operators[$operatorsIndex]['assignment_details'][$day]['shift_restrictions']['worked_passed_10']['current_day'];
      $content['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] = $operators[$operatorsIndex]['assignment_details'][$day]['shift_restrictions']['shift_passed_15_hour_window']['shift_start'];
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
  return $dayRounds;
}

//takes start and end time and calculates total
function calculateShiftMinutes($startTime, $endTime){
  $startHourDigits = floor($startTime/100);
  $startMinuteDigits = $startTime/100 - $startHourDigits;

  $endHourDigits = floor($endTime/100);
  $endMinuteDigits = $endTime/100 - $endHourDigits;

  $startTimeInMinutes = $startHourDigits*60 + $startMinuteDigits*100;
  $endTimeInMinutes = $endHourDigits*60 + $endMinuteDigits*100;

  $shiftLengthInMinutes = $endTimeInMinutes - $startTimeInMinutes;
  return round($shiftLengthInMinutes);
}

//determine the number of rounds in a shift based on the line
function determineNumberRoundsInShift($lineName){
  $shiftLength = [
    'C'=>3,
    'D'=>4,
    'Hs'=>5,
    'S'=>5
  ];
  return $shiftLength[$lineName];
}

//send assigned shift information to db
function updateRoundsInDatabase($conn, $rounds) {
  for( $rowIndex=0; $rowIndex < count($rounds); $rowIndex++ ){
    $userId = $rounds[$rowIndex]['user_id'];
    $roundsId = $rounds[$rowIndex]['id'];
    $roundsStatus = $rounds[$rowIndex]['status'];

    if($roundsStatus === 'scheduled') {
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
  $assignedTimesArray = $operators[$operatorsIndex]['times_assigned'];
  $lengthAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);

  //nothing is the assigned times array
  if (empty($assignedTimesArray)) {
      array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
  }
  //one item in the assigned times array
  else if ($lengthAssignedTimesArray === 1) {
    //the ending time of new entry is the same as the start of the item in the assigned times array
    if (intval($operators[$operatorsIndex]['times_assigned'][0][0]) === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
      $operators[$operatorsIndex]['times_assigned'][0][0] = intval($rounds[$roundsIndex]['round_start']);
    }
    //the starting time of the new entry is the same as the end of the item in the assigned times array
    else if (intval($operators[$operatorsIndex]['times_assigned'][0][1]) === intval($rounds[$roundsIndex]['round_start'])) {
      $operators[$operatorsIndex]['times_assigned'][0][1] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
    }
    //neither the starting time or ending time of new entry is the same of start or end item in the assigned times array
    else if (intval($operators[$operatorsIndex]['times_assigned'][0][1]) !== intval($rounds[$roundsIndex]['round_start']) and intval($operators[$operatorsIndex]['times_assigned'][0][0]) !==
    intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
      array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
    }
  }
  //more than one item in the assigned times array
  else {
    $middle = false;
    for ($assignedTimeIdx = 1; $assignedTimeIdx < $lengthAssignedTimesArray; $assignedTimeIdx++) {
      //item end matches new entry start and new entry end matches next item start
      if (
        $operators[$operatorsIndex]['times_assigned'][$assignedTimeIdx-1][1] === intval($rounds[$roundsIndex]['round_start']) and $operators[$operatorsIndex]['times_assigned'][$assignedTimeIdx][0] === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])){
        $operators[$operatorsIndex]['times_assigned'][$assignedTimeIdx-1][1] = $operators[$operatorsIndex]['times_assigned'][$assignedTimeIdx][1];
        array_splice($operators[$operatorsIndex]['available_times'], $assignedTimeIdx, 1);
        $middle = true;
        break;
      }
    }
    //does not fit exactly between two items in the array
    if (!$middle) {
      //the ending time of new entry is the same as the start of the item in the assigned times array
      for ($assignedTimeIndex = 0; $assignedTimeIndex < $lengthAssignedTimesArray; $assignedTimeIndex++) {
        if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]) ===
        intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
          $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0] = intval($rounds[$roundsIndex]['round_start']);
          break;
        }
         //the starting time of the new entry is the same as the end of the item in the assigned times array
        if (intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1]) === intval($rounds[$roundsIndex]['round_start'])) {
          $operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
          break;
        }
        //neither the starting time or ending time of new entry is the same of start or item in the asssigned times array
        if ($assignedTimeIndex === $lengthAssignedTimesArray - 1){
          array_push($operators[$operatorsIndex]['times_assigned'], [intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])]);
          break;
        }
      }
    }
  }

  return $operators;
}

//adjust the available times array after a shift has been assigned
function adjustAvailableTimes($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds, $availableStartTime, $availableEndTime, $timesIndex) {
  //shift is exactly the same as the available time
  if($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    array_splice($operators[$operatorsIndex]['available_times'], $timesIndex, 1);
  }
  //shift has same beginning as available time
  else if ($availableStartTime === intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    $operators[$operatorsIndex]['available_times'][$timesIndex][0] = intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']);
  }
  //shift has same end as available time
  else if ($availableStartTime < intval($rounds[$roundsIndex]['round_start']) and $availableEndTime === intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
    $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
  }
  //shift in middle of available time
  else if ($availableStartTime <  intval($rounds[$roundsIndex]['round_start']) and $availableEndTime > intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])){
    $newAvailableTimeArray = [intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']), $operators[$operatorsIndex]['available_times'][$timesIndex][1]];
    $operators[$operatorsIndex]['available_times'][$timesIndex][1] = intval($rounds[$roundsIndex]['round_start']);
    array_push($operators[$operatorsIndex]['available_times'], $newAvailableTimeArray);
  }
  return $operators;
}

//check to see if the block that is about to be assigned will take the operator over the continuous hour limit
function checkContinuousHourBlock($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds) {
  $blockTooBig = false;
  $operators = addAssignedTime($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);

  $lengthAssignedTimesArray = count($operators[$operatorsIndex]['times_assigned']);

  for ($assignedTimeIndex = 0; $assignedTimeIndex < $lengthAssignedTimesArray; $assignedTimeIndex++) {
    $endTime = intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][1]);
    $startTime = intval($operators[$operatorsIndex]['times_assigned'][$assignedTimeIndex][0]);
    $blockTime = calculateShiftMinutes($startTime, $endTime);
    if ($blockTime > 300) {
      $blockTooBig = true;
      break;
    }
  }
  return $blockTooBig;
}

//if the line is a special status line and the operator DOES NOT have required status return true.
function checkSpecialStatus($rounds, $roundsIndex, $operators, $operatorsIndex) {
  $specialStatusRequired = false;
  if ($rounds[$roundsIndex]['line_name'] === 'C') {
    $specialStatusRequired = true;
  }
  if ($specialStatusRequired){
    if($operators[$operatorsIndex]['special_route']=== '0' || $operators[$operatorsIndex]['special_route'] === 0) {
      return true;
    }
  }
}

function populateSchedule($operators, $rounds, $conn)  {
//populate the schedule for a particular day
  $lengthOperatorsArray = count($operators);
  $lengthRoundsArray = count($rounds);

  $leftovers = [];
  $previousOperator = '';

  for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray; $roundsIndex++) {

   //determine the line and assign number of rounds to that line
    $lineName = $rounds[$roundsIndex]['line_name'];

    $numberRounds = determineNumberRoundsInShift($lineName);
    if($roundsIndex >= $lengthRoundsArray - 1 - $numberRounds) {
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
    for ($roundOfShift1 = 0; $roundOfShift1 < $numberRounds - 1; $roundOfShift1++){
      if($rounds[$roundsIndex + $roundOfShift1]['line_name'] === $rounds[$roundsIndex +$roundOfShift1 +1] ['line_name']) {
        $roundsOnLineAvailable++;
      }
    }
    //count the number the number of rounds on the same bus number
    for ($roundOfShift2 = 0; $roundOfShift2 < $numberRounds - 1; $roundOfShift2++){
      if($rounds[$roundsIndex + $roundOfShift2]['bus_number'] === $rounds[$roundsIndex +$roundOfShift2 +1] ['bus_number']) {
        $roundsOnBusAvailable++;
      }
    }

    //Are there adequate unassigned rounds, rounds on the same line, rounds on the same bus?
    if ($unassignedRoundsAvailable === $numberRounds and $roundsOnLineAvailable === $numberRounds - 1 and $roundsOnBusAvailable === $numberRounds - 1) {

      //length of the operator array
      $lengthOperatorsArray = count($operators);

      //yes, iterate through each operator
      for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {

        //If the line requires special status and operator DOES NOT have special status, skip the operator.
        $specialStatus = checkSpecialStatus($rounds, $roundsIndex, $operators, $operatorsIndex);
        if ($specialStatus) {
          continue;
        }

        // # of available times for the current operator
        $availableTimes = count($operators[$operatorsIndex]['available_times']);

        //if the the driver worked past 10 pm the night before and the shift is before 8 am skip the operator
        if ($rounds[$roundsIndex]['round_start'] < 800 and $operators[$operatorsIndex]['shift_restrictions']['worked_passed_10']['prior_day'] === 1) {
          continue;
        }

        //if the operator has a shift before 8am, they cannot take a shift that ends later than 9pm
        if (intval($rounds[$roundsIndex]['round_end']) > 2100 && $operators[$operatorsIndex]['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] < 800) {
          continue;
        }

        for ($timesIndex = 0; $timesIndex < $availableTimes; $timesIndex++) {
          //define available start and end times
          $availableStartTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][0]);
          $availableEndTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][1]);

          //Is shift within the available time range of operator?
          if ($availableStartTime <= intval($rounds[$roundsIndex]['round_start']) and $availableEndTime >= intval($rounds[$roundsIndex + $numberRounds - 1]['round_end'])) {
            //if operator will exceed 8 hours (480 minutes) once the shift is added, skip the operator
            $totalShiftTime = calculateShiftMinutes(intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
            $totalMinutesInDay = intval($operators[$operatorsIndex]['total_daily_minutes']) + $totalShiftTime;
            if ($totalMinutesInDay > 480) {
              break;
            }
            //if the total weekly minutes exceeds 29 hours (1740 minutes) once the shift is added, skip the operator
            $totalWeeklyMinutes = intval($operators[$operatorsIndex]['total_weekly_minutes']) + $totalShiftTime;
            if ($totalWeeklyMinutes > 1740) {
              break;
            }

            // Check to see if the operator will have too many hours if the shift is added. If so, skip that operator
            $blockTooBig = checkContinuousHourBlock($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);
            //if there is not a problem with continous block
            if (!$blockTooBig) {

              //Don't assign this round to an operator if the round starts within 30 minutes after the operator worked 5 continuous hours
              if (intval($rounds[$roundsIndex]['round_start']) - intval($operators[$operatorsIndex]['shift_restrictions']['30minute_break']) < 30) {
                break;
              }

              //if all critera met, update the rounds in the schedule
              for ($roundOfShift = 0; $roundOfShift < $numberRounds; $roundOfShift++) {
                $rounds[$roundsIndex + $roundOfShift]['user_id'] = $operators[$operatorsIndex]['user_id'];
                //TODO:EVENTUALLY REMOVE LINES 348 and 349 - only for physcial print out/debugging not for db
                $rounds[$roundsIndex + $roundOfShift]['last_name'] = $operators[$operatorsIndex]['last_name'];
                $rounds[$roundsIndex + $roundOfShift]['first_name'] = $operators[$operatorsIndex]['first_name'];
                $rounds[$roundsIndex + $roundOfShift]['status'] = 'scheduled';
              }
              //adjust total daily and weekly hours
              $totalShiftTime = calculateShiftMinutes(intval($rounds[$roundsIndex]['round_start']), intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']));
              $operators[$operatorsIndex]['total_weekly_minutes'] = intval($operators[$operatorsIndex]['total_weekly_minutes']) + $totalShiftTime;
              $operators[$operatorsIndex]['total_daily_minutes'] = intval($operators[$operatorsIndex]['total_daily_minutes']) + $totalShiftTime;

              //shift assignment was made
              $madeAssignment = true;

              //add the time added to assigned times for the operator
              $operators = addAssignedTime ($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds);

              //adjust the times the operator is available
              $operators = adjustAvailableTimes ($operators, $rounds, $operatorsIndex, $roundsIndex, $numberRounds, $availableStartTime, $availableEndTime, $timesIndex);

              //set the flag for after 10 pm shift
              if (intval($rounds[$roundsIndex + $numberRounds - 1]['round_end']) > 2200) {
                $operators[$operatorsIndex]['shift_restrictions']['worked_passed_10']['current_day'] = 1;
              }

              //set the flag for the shift start time of the 15hr restriction
              if (intval($rounds[$roundsIndex]['round_start']) < 800) {
                $operators[$operatorsIndex]['shift_restrictions']['shift_passed_15_hour_window']['shift_start'] = $rounds[$roundsIndex]['round_start'];
              }

              $previousOperator = $operators[$operatorsIndex];

            } else {
              //set the flag for the required 30 minute break after working 5 continuous hours
              $latestShiftIndex = count($operators[$operatorsIndex]['times_assigned']) - 1;
              $latestShift = $operators[$operatorsIndex]['times_assigned'][$latestShiftIndex];
              if ($latestShift[1] - $latestShift[0] === 500) {
                $operators[$operatorsIndex]['shift_restrictions']['30minute_break'] = intval($latestShift[1]);
              }
            }
          }
          if ($madeAssignment) {
            break;
          }
        }
      }
    }

    if (intval($rounds[$roundsIndex]['user_id']) === 1) {
      array_push($leftovers, [
        'previousOperator' => $previousOperator,
        'followingOperator' => '',
        'unassignedRound' => $rounds[$roundsIndex]
      ]);
      $previousOperator = '';
    }

  }

  print('<pre>');
  print_r($leftovers);
  print('<pre>');

  updateRoundsInDatabase($conn, $rounds);
  $rounds = json_encode($rounds);
  return $operators;
}

//populate the first week
function populateTemplateWeek ($conn, $rounds, $operators) {
  $dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for ($dayOfWeekIndex = 0; $dayOfWeekIndex < 7; $dayOfWeekIndex++) {
    $specificDayOfWeek = $dayOfWeek[$dayOfWeekIndex];
    $roundsForDay = buildRoundsByDay($rounds, $specificDayOfWeek);
    $operatorsForDay = buildOperatorsByDay($operators, $specificDayOfWeek);
    $revOperatorsSpecificDay = populateSchedule($operatorsForDay, $roundsForDay, $conn);
    for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
      for ($revOperatorsSpecificDayIndex = 0; $revOperatorsSpecificDayIndex < count($revOperatorsSpecificDay); $revOperatorsSpecificDayIndex++) {
        if ($revOperatorsSpecificDay[$revOperatorsSpecificDayIndex]['user_id'] === $operators[$operatorsIndex]['user_id']) {
        $operators[$operatorsIndex]['total_weekly_minutes'] = $revOperatorsSpecificDay[$revOperatorsSpecificDayIndex]['total_weekly_minutes'];
        }
        if ($revOperatorsSpecificDay[$revOperatorsSpecificDayIndex]['shift_restrictions']['worked_passed_10']['current_day'] === 1) {
          $operators[$operatorsIndex]['assignment_details'][$dayOfWeek[$dayOfWeekIndex]]['shift_restrictions']['worked_passed_10']['prior_day'] = 1;
        }
      }
    }
  }
}



//**PROCESSING**/
$quarterStartTimestamp = 1566100800;
$quarterEndTimestamp = 1576904400;
$beginningOfWeekTimeStamp = $quarterStartTimestamp;

//populate the entire quarter based on the template week
// while ($beginningOfWeekTimeStamp < $quarterEndTimestamp ) {
  $rounds = [];
  $operators = [];
  $rounds = getRoundsData($conn, $beginningOfWeekTimeStamp);
  $operators = getOperatorsData($conn);
  populateTemplateWeek($conn, $rounds, $operators);
  $beginningOfWeekTimeStamp = strtotime('+7 days', $beginningOfWeekTimeStamp);
// }

?>
