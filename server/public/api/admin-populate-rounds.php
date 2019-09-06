<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');


$query = "SELECT rt.line_name, bi.bus_number, 
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


// $rounds = json_encode($rounds);

// print($rounds);

$operatorsQuery = "
  SELECT 
  id AS user_id, 
  last_name, 
  first_name 
  FROM user 
  WHERE role = 'operator' AND status = 'active'";

$resultoperatorsQuery = mysqli_query($conn, $operatorsQuery);

if(!$resultoperatorsQuery){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$operators = [];
$fetchedUserIDs = [];
$baseDayStructure = [
  'available_times'=>[],
  'times_assigned'=>[],
  'continuous_hours_assigned'=>0,
  'total_daily_hours'=>0
];

while ($row = mysqli_fetch_assoc($resultoperatorsQuery)) {
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
  $operators[$row['user_id']] = $row;
}

$operatorCSV = implode(',', $fetchedUserIDs);
$operatorAvailabilityQuery = "SELECT user_id, day_of_week, CONCAT(start_time, ' , ', end_time) AS availability FROM `operator_availability` WHERE session_id = 1 AND user_id IN ({$operatorCSV})";

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

    $operators[$userID]['assignment_details'][$currentDay]['available_times'][] = $userAvailability[$availabilityIndex]['availability'];

  }

}


// $operators = [];

//dummy data to use while the operators query is being built
// $operators = [ 
//   ["user_id"=> 2345, "last_name"=> "Smith",  "first_name"=> "Fred", "total_weekly_hours"=> 12,
//   "assignment_details" => [
//     'Sun' => [
//       "available_times"=> [
//         [1600, 1700],
//         [1800, 1900]
//       ], 
//       "times_assigned"=> [
//         [1300, 1600], 
//         [1700, 1800]
//       ], 
//       "continuous_hours_assigned"=> 3,
//       "total_daily_hours"=> 4
//       ],
//       "Mon" => [
//         "available_times"=> [
//           [1600, 1700],
//           [1800, 1900]
//         ], 
//         "times_assigned"=> [
//           [1300, 1600], 
//           [1700, 1800]
//         ], 
//         "continuous_hours_assigned"=> 3,
//         "total_daily_hours"=> 4
//       ], 
//       "Tue" => [],
//       "Wed" => [
//         "available_times"=> [[1000, 1500]], 
//         "times_assigned"=> [], 
//         "continuous_hours_assigned"=> 0,
//         "total_daily_hours"=> 0
//       ],  
//       "Thu" => [
//         "available_times"=> [[1000, 1200]],
//         "times_assigned"=> [
//           [800, 1000], 
//           [1200, 1400]
//         ], 
//         "continuous_hours_assigned"=> 2,
//         "total_daily_hours"=> 4
//       ], 
//       'Fri' => [],
//       'Sat' => []
//     ]
//   ], 
//   ["user_id" => 4560, "last_name"=> "Wu", "first_name"=> "Vicky", "total_weekly_hours"=> 7, "assignment_details" => [
//       "Sun" => [
//         "available_times"=> [
//           [600, 800],
//           [900, 1000]
//         ], 
//         "times_assigned"=> [[800, 900]], 
//         "continuous_hours_assigned"=> 1,
//         "total_daily_hours"=> 1
//       ],
//       "Mon" => [], 
//       "Tue" => [],
//       "Wed" => [
//         "available_times"=> [[1800,2000]], 
//         "times_assigned"=> [[2000, 2200]], 
//         "continuous_hours_assigned"=> 2,
//         "total_daily_hours"=> 0
//       ],
//       "Thu" => [
//         "available_times"=> [
//         ], 
//         "times_assigned"=> [[600, 1000]], 
//         "continuous_hours_assigned"=> 4,
//         "total_daily_hours"=> 0
//       ], 
//       'Fri' => [],
//       'Sat' => []
//     ]
//   ],
//   ["user_id" => 4560, "last_name"=> "Jones", "first_name"=> "Sarah", "total_weekly_hours"=> 5, "assignment_details" => [
//       'Sun' => [],
//       "Mon" => [
//         "available_times"=> [
//           [700, 800],
//           [900, 1000]
//         ], 
//         "times_assigned"=> [
//           [600, 700], 
//           [800, 900]
//         ], 
//         "continuous_hours_assigned"=> 1,
//         "total_daily_hours"=> 2
//       ], 
//       "Tue" => [],
//       "Wed" => [
//         "available_times"=> [[600, 1000]], 
//         "times_assigned"=> [], 
//         "continuous_hours_assigned"=> 0,
//         "total_daily_hours"=> 0
//       ],  
//       "Thu" => [
//         "available_times"=> [[1300,1600]],
//         "times_assigned"=> [
//           [1100, 1300], 
//           [1600, 1700]
//         ], 
//         "continuous_hours_assigned"=> 2,
//         "total_daily_hours"=> 3
//       ], 
//       'Fri' => [],
//       'Sat' => []
//     ]
//   ]
// ];
// print_r($operators);
// print("***************");
// echo 'OPERATORDETAILS FROM DB<pre>';
// print_r($operators);
// echo '</pre>';
// exit();
// $operators = $operators;
//this eventually needs to go into a function
//leave it as is for now.
$sundayOperators = [];

foreach ($operators as &$operator) {
    if(!empty($operator['assignment_details']['Sun']['available_times'])){
      $content['user_id'] = $operator['user_id'];
      $content['last_name'] = $operator['last_name'];
      $content['first_name'] = $operator['first_name'];
      $content['total_weekly_hours'] = $operator['total_weekly_hours'];
      $content['available_times'] = $operator['assignment_details']['Sun']['available_times'];
      $content['times_assigned'] = $operator['assignment_details']['Sun']['times_assigned'];
      $content['continuous_hours_assigned'] = $operator['assignment_details']['Sun']['continuous_hours_assigned'];
      $content['total_daily_hours'] = $operator['assignment_details']['Sun']['total_daily_hours'];
      array_push($sundayOperators, $content);
    }
}

// for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
//   if(!empty($operators[$operatorsIndex]['assignment_details']['Sun'])) {
    
    
  // }
// }



echo 'SUNDAY OPERATORS ARRAY<pre>';
print_r($operators[4]['assignment_details']['Sun']['available_times']);
print(count($operators[4]['assignment_details']['Sun']['available_times']));
echo '</pre>';
// exit();

function sundayOperatorsSort($a, $b) {
  if ($a['total_weekly_hours'] == $b['total_weekly_hours']) {
      return 0;
  } else {
    return ($a['total_weekly_hours'] < $b ['total_weekly_hours']) ? -1 : 1;
  }
}

function populateSchedule($operators, $rounds)  {
  $lengthOperatorsArray = count($operators);
  $lengthRoundsArray = count($rounds);

  for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray ; $roundsIndex++) {
    //not enough rounds to assign -- end of the round array
    if ($roundsIndex === $lengthRoundsArray -2) {
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

    //check to make sure we have three unassigned rounds
    if ($rounds[$roundsIndex]['user_id'] === '1' and $rounds[$roundsIndex + 1]['user_id'] === '1' and $rounds[$roundsIndex + 2]['user_id'] === '1') {  

      //check to make sure all three rounds are on the same route (bus lines)
      if ($rounds[$roundsIndex]['line_name'] === $rounds[$roundsIndex + 1]['line_name'] and $rounds[$roundsIndex + 1]['line_name'] === $rounds[$roundsIndex + 2]['line_name']) {

        $shiftStartTime = intval($rounds[$roundsIndex]['round_start']);
        $shiftEndTime = intval($rounds[$roundsIndex + 2]['round_end']);
        $lengthOperatorsArray = count($operators);
        //PSEUDOCODE FOR CONTINUOUS BLOCKS, HOURS PER WEEK

        //iterate through each operator
        for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {

          //array of available time slots for one operator
          $availabilityArray = $operators[$operatorsIndex]['available_times']; 
          //number of available time slots
          $lengthTimesAvailableArray = count($availabilityArray); 
      
          //problem here - we are deleting the element, but it is still reading the same length
          for ($timesIndex = 0; $timesIndex < $lengthTimesAvailableArray; $timesIndex++) {
   
            $availableStartTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][0]);

            $availableEndTime = intval($operators[$operatorsIndex]['available_times'][$timesIndex][1]);

            //Is shift within the available time range of operator?
            if ($availableStartTime <= $shiftStartTime and $availableEndTime >= $shiftEndTime) {
              
              //yes, update the rounds in the schedule
              for ($roundOfShift = 0; $roundOfShift < 3; $roundOfShift++) {
                $rounds[$roundsIndex + $roundOfShift]['user_id'] = $operators[$operatorsIndex]['user_id'];
                $rounds[$roundsIndex + $roundOfShift]['last_name'] = $operators[$operatorsIndex]['last_name'];
                $rounds[$roundsIndex + $roundOfShift]['first_name'] = $operators[$operatorsIndex]['first_name'];
              }

              //yes, adjust total daily and weekly hours
              $totalShiftTime = ($shiftEndTime-$shiftStartTime)/100;

              $operators[$operatorsIndex]['total_weekly_hours'] = intval($operators[$operatorsIndex]['total_weekly_hours']) + $totalShiftTime;

              $operators[$operatorsIndex]['total_daily_hours'] = intval($operators[$operatorsIndex]['total_daily_hours']) + $totalShiftTime;

              //yes, a shift assignement was made
              $madeAssignment = true;

              //yes, add the time added to the master schedule to the assigned times for the operator
              array_push($operators[$operatorsIndex]['times_assigned'], [$shiftStartTime, $shiftEndTime]);

              //yes, adjust available times
              //shift is exactly the same as the available time
              if($availableStartTime === $shiftStartTime and $availableEndTime === $shiftEndTime) {
                $availableTimeToRemove = $operators[$operatorsIndex]['available_times'];
                array_splice($operators[$operatorsIndex]['available_times'], $timesIndex, 1);
                break;
              }

              //shift has same beginning as available time
              if ($availableStartTime === $shiftStartTime and $availableEndTime < $shiftEndTime) {
                $operators[$operatorsIndex]['available_times'][$timesIndex][0] = $shiftEndTime;
                break;
              }

              //shift has same end as available time
              if ($availableStartTime > $shiftStartTime and $availableEndTime === $shiftEndTime) {
                $operators[$operatorsIndex]['available_times'][$timesIndex][1] = $shiftStartTime;
                break;
              }

              //shift in middle of available time
              if ($availableStartTime < $shiftStartTime and $availableEndTime > $shiftEndTime){
                $newAvailableTimeArray = [$shiftEndTime, $operators[$operatorsIndex]['available_times'][$timesIndex][1]];
                $operators[$operatorsIndex]['available_times'][$timesIndex][1] = $shiftStartTime;
                array_push($operators[$operatorsIndex]['available_times'], $newAvailableTimeArray);
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
  }
  $rounds = json_encode($rounds);
  print("\n". $rounds);
}

uasort($sundayOperators, 'sundayOperatorsSort');
$sundayOperators = array_values($sundayOperators);
populateSchedule($sundayOperators, $rounds);

//add similar functionality for other days of week.

//NOTES and other materials we are using for debugging.
// echo '<pre>';
// print_r($sundayOperators);
// echo '</pre>';
// exit();

// "SELECT user_id, day_of_week, CONCAT('[',GROUP_CONCAT(CONCAT('[',start_time,',', end_time,']')),']') AS available_times FROM `operator_availability` WHERE session_id = 1 GROUP BY user_id, day_of_week";
?>

