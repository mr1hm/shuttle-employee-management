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

//dummy data to use while the operators query is being built
$operators = [ 
  ["user_id"=> 2345, "last_name"=> "Smith",  "first_name"=> "Fred", "total_weekly_hours"=> 12,
  "assignment_details" => [
    'Sun' => [
      "available_times"=> [
        [1600, 1700],
        [1800, 1900]
      ], 
      "times_assigned"=> [
        [1300, 1600], 
        [1700, 1800]
      ], 
      "continuous_hours_assigned"=> 3,
      "total_daily_hours"=> 4
      ],
      "Mon" => [
        "available_times"=> [
          [1600, 1700],
          [1800, 1900]
        ], 
        "times_assigned"=> [
          [1300, 1600], 
          [1700, 1800]
        ], 
        "continuous_hours_assigned"=> 3,
        "total_daily_hours"=> 4
      ], 
      "Tue" => [],
      "Wed" => [
        "available_times"=> [[1000, 1500]], 
        "times_assigned"=> [], 
        "continuous_hours_assigned"=> 0,
        "total_daily_hours"=> 0
      ],  
      "Thu" => [
        "available_times"=> [[1000, 1200]],
        "times_assigned"=> [
          [800, 1000], 
          [1200, 1400]
        ], 
        "continuous_hours_assigned"=> 2,
        "total_daily_hours"=> 4
      ], 
      'Fri' => [],
      'Sat' => []
    ]
  ], 
  ["user_id" => 4560, "last_name"=> "Wu", "first_name"=> "Vicky", "total_weekly_hours"=> 7, "assignment_details" => [
      "Sun" => [
        "available_times"=> [
          [600, 800],
          [900, 1000]
        ], 
        "times_assigned"=> [[800, 900]], 
        "continuous_hours_assigned"=> 1,
        "total_daily_hours"=> 1
      ],
      "Mon" => [], 
      "Tue" => [],
      "Wed" => [
        "available_times"=> [[1800,2000]], 
        "times_assigned"=> [[2000, 2200]], 
        "continuous_hours_assigned"=> 2,
        "total_daily_hours"=> 0
      ],
      "Thu" => [
        "available_times"=> [
        ], 
        "times_assigned"=> [[600, 1000]], 
        "continuous_hours_assigned"=> 4,
        "total_daily_hours"=> 0
      ], 
      'Fri' => [],
      'Sat' => []
    ]
  ],
  ["user_id" => 4560, "last_name"=> "Jones", "first_name"=> "Sarah", "total_weekly_hours"=> 5, "assignment_details" => [
      'Sun' => [],
      "Mon" => [
        "available_times"=> [
          [700, 800],
          [900, 1000]
        ], 
        "times_assigned"=> [
          [600, 700], 
          [800, 900]
        ], 
        "continuous_hours_assigned"=> 1,
        "total_daily_hours"=> 2
      ], 
      "Tue" => [],
      "Wed" => [
        "available_times"=> [[600, 1000]], 
        "times_assigned"=> [], 
        "continuous_hours_assigned"=> 0,
        "total_daily_hours"=> 0
      ],  
      "Thu" => [
        "available_times"=> [[1300,1600]],
        "times_assigned"=> [
          [1100, 1300], 
          [1600, 1700]
        ], 
        "continuous_hours_assigned"=> 2,
        "total_daily_hours"=> 3
      ], 
      'Fri' => [],
      'Sat' => []
    ]
  ]
];

//this eventually needs to go into a function
//leave it as is for now.
$sundayOperators = [];

for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
  if(count($operators[$operatorsIndex]['assignment_details']['Sun'])) {
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
    //ERROR IN THIS CODE due to an undefined array item (for some reason we are removing an item, but the index is not adjusting -- array_splice should be the right solution)
    for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {
      $availableTimesArrayLength = count($operators[$operatorsIndex]['available_times']);
      if (!$availableTimesArrayLength){
        array_splice($operators, $operatorsIndex, 1);
      }
    }
    //sort the operator array, put operator with fewest weekly hours at the top
    uasort($operators, 'sundayOperatorsSort'); 

    //check to make sure we have three unassigned rounds
    if ($rounds[$roundsIndex]['user_id'] === '1' and $rounds[$roundsIndex + 1]['user_id'] === '1' and $rounds[$roundsIndex + 2]['user_id'] === '1') {  

      //check to make sure all three rounds are on the same route (bus lines)
      if ($rounds[$roundsIndex]['line_name'] === $rounds[$roundsIndex + 1]['line_name'] and $rounds[$roundsIndex + 1]['line_name'] === $rounds[$roundsIndex + 2]['line_name']) {

        $shiftStartTime = intval($rounds[$roundsIndex]['round_start']);
        $shiftEndTime = intval($rounds[$roundsIndex + 2]['round_end']);
        $lengthOperatorsArray = count($operators);
        //PSEUDOCODE FOR CONTINUOUS BLOCKS, HOURS PER WEEK
        // for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++){
        //   remove anyone who will exceed the total_weekly_hours
        //   if ($operators[$operatorsIndex]['total_weekly_hours'] > 29 - $shiftTime) {
        //     unset($operators[$operatorsIndex]);  
        //     // $operators = array_values($operators); 
        //   }
        //   remove anyone who will exceed the total_daily_hours
        //   if ($operators[$operatorsIndex]['total_daily_hours'] > 8 - $shiftTime) {
        //    unset($operators[$operatorsIndex]);  
        //    $operators = array_values($operators); 
        //   }
        //   need to add logic eventually to remove anyone who has exceeded the max continuous hours
        // }

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
populateSchedule($sundayOperators, $rounds);

//add similar functionality for other days of week.

//NOTES and other materials we are using for debugging.
// echo '<pre>';
// print_r($sundayOperators);
// echo '</pre>';
// exit();
?>

