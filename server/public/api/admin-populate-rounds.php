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

// only includes user info and route preferences
// $operatorsQuery ="SELECT orp.user_id,
//                 us.last_name,
//                 us.first_name,
//                 GROUP_CONCAT(rt.line_name) AS `lines`,
//                 GROUP_CONCAT(JSON_OBJECT('day', oa.day_of_week, 'start_time', oa.start_time, 'stop_time', oa.end_time)) AS `availability`
//           FROM user AS us 
//           JOIN operator_route_preference AS orp ON us.id = orp.user_id
//           JOIN operator_availability AS oa ON us.id = oa.user_id
//           JOIN route AS rt ON orp.route_id = rt.id
//           WHERE orp.session_id = 1
//           GROUP BY us.id";

// $result2 = mysqli_query($conn, $operatorsQuery);

// if(!$result2)[
//   throw new Exception('MySQL error=> '.mysqli_error($conn));
// ]

// $operators = [];
// $availabilityLookup = [
//   1=>[
//     [
//       'day' => 'Mon',
//       'stop_time' => 930,
//       'start_time' => 700
//     ]
//   ]
// ];
// $preferencesLookup = [
//   'line'=>[1,2,3]
// ];

// while ($row = mysqli_fetch_assoc($result2)) [

//   $row['lines'] = explode(",", $row['lines']);
//   $row['lines'] = array_unique($row['lines']);  
//   $row['availability'] = json_decode('['.$row['availability'].']', true, JSON_INVALID_UTF8_IGNORE);

//   $tempAvailabilities = [];
//   foreach($row['availability'] AS $value)[
//     $keyString = "[$value['day']][$value['start_time']][$value['stop_time']]";
//     $tempAvailabilities[$row['user_id']][$keyString] = $value;
//   ]

//   $row['availability'] = $tempAvailabilities;
//   foreach($row['lines'] as $value)[
//     if(!isset($preferencesLookup[$value]))[
//       $preferencesLookup[$value] = [];
//     ]
//     $preferencesLookup[$value][] = [
//       'userid'=>$row['user_id'],
//       'username'=> "[$row['first_name']][$row['last_name']]",
//       'availabilities'=>$tempAvailabilities
//     ];
//   ]
//   $operators[] = $row;
// ]
// print_r($preferencesLookup);
// // exit();
// $operatorsForTesting = json_encode($operators);
// print($operatorsForTesting);
// exit();
//population 3 rounds for each user with line preference
//require 3 line preferences for each operator
//does not handle assignments with block is less than 3 rounds

//dummy data to use while query is being built
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

$sundayOperators = [];

for($operatorsIndex = 0; $operatorsIndex < count($operators); $operatorsIndex++) {
  if(count($operators[$operatorsIndex]['assignment_details']['Sun'])) {
    $content['user_id'] = $operators[$operatorsIndex]['user_id'];
    $content['last_name'] = $operators[$operatorsIndex]['last_name'];
    $content['first_name'] = $operators[$operatorsIndex]['first_name'];
    $content['total_weekly_hours'] = $operators[$operatorsIndex]['total_weekly_hours'];
    // $content['total_daily_hours'] = $operators[$operatorsIndex]['assignment_details']['Sun'][''];
    $content['available_times'] = $operators[$operatorsIndex]['assignment_details']['Sun']['available_times'];
    $content['times_assigned'] = $operators[$operatorsIndex]['assignment_details']['Sun']['times_assigned'];
    $content['continuous_hours_assigned'] = $operators[$operatorsIndex]['assignment_details']['Sun']['continuous_hours_assigned'];
    $content['total_daily_hours'] = $operators[$operatorsIndex]['assignment_details']['Sun']['total_daily_hours'];
    array_push($sundayOperators, $content);
  }
}
// print_r($sundayOperators);

function sundayOperatorsSort($a, $b) {
  if ($a['total_weekly_hours'] == $b['total_weekly_hours']) {
      return 0;
  } else {
    return ($a['total_weekly_hours'] < $b ['total_weekly_hours']) ? -1 : 1;
  }
}
uasort($sundayOperators, 'sundayOperatorsSort');
// print ('Operators array condensed to only show operators with Sunday availability, unnecessary content removed:  ');
// print_r($sundayOperators);


$lengthOperatorsArray = count($sundayOperators);
$lengthRoundsArray = count($rounds);

for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray ; $roundsIndex++) {
  //not enough rounds to assign, exit
  if ($roundsIndex === $lengthRoundsArray -2) {
    break;
  } 
  $madeAssignment = false;
  //check to make sure we have times available, if not remove that person
  for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {
    if (!count($sundayOperators[$operatorsIndex]['available_times'])){
      unset($sundayOperators[$operatorsIndex]);  
    }
  }
  //sort the operator array, put operator with fewest weekly hours at the top
  uasort($sundayOperators, 'sundayOperatorsSort'); 
  // print_r($sundayOperators);

  //check to make sure we have three unassigned rounds
  if ($rounds[$roundsIndex]['user_id'] === '1' and $rounds[$roundsIndex + 1]['user_id'] === '1' and $rounds[$roundsIndex + 2]['user_id'] === '1') {  

    //check to make sure all three rounds are on the same line
    if ($rounds[$roundsIndex]['line_name'] === $rounds[$roundsIndex + 1]['line_name'] and $rounds[$roundsIndex + 1]['line_name'] === $rounds[$roundsIndex + 2]['line_name']) {

      $shiftStartTime = intval($rounds[$roundsIndex]['round_start']);
      $shiftEndTime = intval($rounds[$roundsIndex + 2]['round_end']);
      $lengthOperatorsArray = count($sundayOperators);
      // for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++){
      //   //remove anyone who will exceed the total_weekly_hours
      //   if ($sundayOperators[$operatorsIndex]['total_weekly_hours'] > 29 - $shiftTime) {
      //     unset($sundayOperators[$operatorsIndex]);  
      //     // $sundayOperators = array_values($sundayOperators); 
      //   }
      //   //remove anyone who will exceed the total_daily_hours
      //   // if ($sundayOperators[$operatorsIndex]['total_daily_hours'] > 8 - $shiftTime) {
      //   //   unset($sundayOperators[$operatorsIndex]);  
      //   //   $sundayOperators = array_values($sundayOperators); 
      //   // }
      //   //need to add logic eventually to remove anyone who has exceeded the max continuous hours
      // }

      for ($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {

        $availabilityArray = $sundayOperators[$operatorsIndex]['available_times'];
        $lengthTimesAvailableArray = count($availabilityArray);

        for ($timesIndex = 0; $timesIndex < $lengthTimesAvailableArray; $timesIndex++) {

          if (intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0]) <= $shiftStartTime and intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]) >= $shiftEndTime) {
            
            for ($roundOfShift = 0; $roundOfShift < 3; $roundOfShift++) {
              $rounds[$roundsIndex + $roundOfShift]['user_id'] = $sundayOperators[$operatorsIndex]['user_id'];
              $rounds[$roundsIndex + $roundOfShift]['last_name'] = $sundayOperators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $roundOfShift]['first_name'] = $sundayOperators[$operatorsIndex]['first_name'];
            }

            //adjust assigned time
            array_push($sundayOperators[$operatorsIndex]['times_assigned'], [$shiftStartTime, $shiftEndTime]);

            //adjust available times
            //if the entire block is assigned (start and end times are the same)
            if(intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0]) === $shiftStartTime and intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]) === $shiftEndTime) {
              $AvailableTimeToRemove = $sundayOperators[$operatorsIndex]['available_times'][$timesIndex];
              unset($AvailableTimeToRemove);  
              // $sundayOperators = array_values($sundayOperators[$operatorsIndex]['times_available']); 
            }
            //first part of block is assigned
            if (intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0]) === $shiftStartTime and intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]) < $shiftEndTime) {
              $sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0] = $shiftEndTime;
            }
            //second part of block is assigned
            if (intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0]) > $shiftStartTime and intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]) === $shiftEndTime) {
              $sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1] = $shiftStartTime;
            }

            //neither start of end time are the same
            if (intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][0]) < $shiftStartTime and intval($sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]) > $shiftEndTime){
              $newAvailableTimeArray = [$shiftEndTime, $sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1]];
              print_r($newAvailableTimeArray);
              $sundayOperators[$operatorsIndex]['available_times'][$timesIndex][1] = $shiftStartTime;
              array_push($sundayOperators[$operatorsIndex]['available_times'], $newAvailableTimeArray);
            }
            //adjust total shift time
            $totalShiftTime = ($shiftEndTime-$shiftStartTime)/100;
            $sundayOperators[$operatorsIndex]['total_weekly_hours'] = intval($sundayOperators[$operatorsIndex]['total_weekly_hours']) + $totalShiftTime;
            $sundayOperators[$operatorsIndex]['total_daily_hours'] = intval($sundayOperators[$operatorsIndex]['total_daily_hours']) + $totalShiftTime;

            $madeAssignment = true;
            break;
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


//trial sort

// $testArray= [
//     '1234' => ['total_weekly_hours' => 6,'K2' => 'ValB'],
//     '2234' => ['total_weekly_hours' => 3,'K2' => 'ValB1'],
//     '5467' => ['total_weekly_hours' => 10,'K2' => 'ValB2'],
//     '8701' => ['total_weekly_hours' => 9,'K2' => 'ValB3']
//   ];

// function testSort($a, $b) {
//     if ($a['total_weekly_hours'] == $b['total_weekly_hours']) {
//         return 0;
//     } else {
//       return ($a['total_weekly_hours'] < $b ['total_weekly_hours']) ? -1 : 1;
//     }
// }
// uasort($testArray, 'testSort');
// print_r($testArray);

//new pseudocode
//sort the rounds so they are ordered by=> a) day, b) lines (C, D, etc.) and c) busses (1, 2, 3, etc.), d) times -- for right now we will be using perfect data (already sorted)
//what the data looks like
//line d, bus 1, day, start_time, end_time
// confirm there are at least 3 rows that are not assigned
//find the first person that matches the time requirement
//assign the person to the rounds
//adjust the available hours for the person
//add the hours to a day counter for the person
//add the hours to a week counter for the person
//find a person in the look-up table that has an opening in their schedule to take this block (since people could have the same time block open on multiple lines, the lookup table would have to be rebuilt after every assignment - with this system I not sure how to get t
//

// If it is easier to go for the full final version, here is the everything we know I know we need 

// in JavaScript
// var operators = [
//   [
//     "user_id"=> 2345, 
//     "last_name"=> "Smith", 
//     "first_name"=> "Fred", 
//     "total_weekly_hours"=> 6,
//     "assignment_details"=> [
//       "Mon"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 0700,"end_time"=> 0800],
//               ["start_time"=> 0900, "end_time"=> 1000]
//             ],
//             "times_assigned"=> [
//               [start_time=> 0600 , end_time=> 0700], 
//               [start_time=> 0800, end_time=> 0900]
//             ],
//             "continuous_hours_assigned"=> 1
//           ],
//           [
//             "available_times"=> [
//               ["start_time"=> 1400,"end_time"=> 1600]
//             ],
//             "hours_assigned"=> [
//               [start_time=> 1200 , end_time=> 1400]
//             ],
//             "continuous_hours_assigned"=> 2
//           ]
//         ],
//         total_hours_assigned=> 4
//       ],
//       "Wed"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 1400,"end_time"=> 1800]
//             ],
//             "times_assigned"=> [
//               [start_time=> 1200 , end_time=> 1400]
//             ],
//             "continuous_hours_assigned"=> 2
//           ]
//         ],
//         total_hours_assigned=> 2
//       ],
//       "Fri"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 0600,"end_time"=> 1000]
//             ],
//             "times_assigned"=> [
//             ],
//             "continuous_hours_assigned"=> 0
//           ]
//         ],
//         total_hours_assigned=> 0
//       ]
//     ]
//   ],
//   [
//     "user_id"=> 4657, 
//     "last_name"=> "Wu", 
//     "first_name"=> "Vicky", 
//     "total_weekly_hours"=> 10,
//     "assignment_details"=> [
//       "Tue"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 1100,"end_time"=> 1300],
//               ["start_time"=> 1500, "end_time"=> 1700]
//             ],
//             "times_assigned"=> [
//               [start_time=> 1300 , end_time=> 1500]
//             ],
//             "continuous_hours_assigned"=> 2
//           ],
//           [
//             "available_times"=> [
//               ["start_time"=> 2000,"end_time"=> 2200]
//             ],
//             "hours_assigned"=> [
//               [start_time=> 1900 , end_time=> 2000]
//             ],
//             "continuous_hours_assigned"=> 1
//           ]
//         ],
//         total_hours_assigned=> 3
//       ],
//       "Wed"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 0600,"end_time"=> 0700]
//             ],
//             "times_assigned"=> [
//               [start_time=> 0700 , end_time=> 0800]
//             ],
//             "continuous_hours_assigned"=> 1
//           ]
//         ],
//         total_hours_assigned=> 1
//       ],
//       "Sat"=> [
//         time_blocks=> [
//           [
//             "available_times"=> [
//               ["start_time"=> 0600,"end_time"=> 1000]
//             ],
//             "times_assigned"=> [
//             ],
//             "continuous_hours_assigned"=> 0
//           ]
//         ],
//         total_hours_assigned=> 0
//       ]
//     ]
//   ],
// ]
?>

