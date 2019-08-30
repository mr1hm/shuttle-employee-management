<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$roundsQuery = "SELECT rt.line_name, bi.bus_number, 
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

$result = mysqli_query($conn, $roundsQuery);

if(!$result){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$rounds = [];

while ($row = mysqli_fetch_assoc($result)) {
    $rounds[] = $row;
}

// $rounds = json_encode($rounds);

// print($rounds);

// only includes user info and route preferences
$operatorsQuery ="SELECT orp.user_id,
                us.last_name,
                us.first_name,
                GROUP_CONCAT(rt.line_name) AS `lines`,
                GROUP_CONCAT(JSON_OBJECT('day', oa.day_of_week, 'start_time', oa.start_time, 'stop_time', oa.end_time)) AS `availability`
          FROM user AS us 
          JOIN operator_route_preference AS orp ON us.id = orp.user_id
          JOIN operator_availability AS oa ON us.id = oa.user_id
          JOIN route AS rt ON orp.route_id = rt.id
          WHERE orp.session_id = 1
          GROUP BY us.id";

$result2 = mysqli_query($conn, $operatorsQuery);

if(!$result2){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$operators = [];
$availabilityLookup = [
  1=>[
    [
      'day' => 'Mon',
      'stop_time' => 930,
      'start_time' => 700
    ]
  ]
];
$preferencesLookup = [
  'line'=>[1,2,3]
];

while ($row = mysqli_fetch_assoc($result2)) {

  $row['lines'] = explode(",", $row['lines']);
  $row['lines'] = array_unique($row['lines']);  
  $row['availability'] = json_decode('['.$row['availability'].']', true, JSON_INVALID_UTF8_IGNORE);
  // $availabilityLookup[ $row['user_id']] = [
  //   'data'=>$row,
  //   'availableDateTimes' => []
  // ];
  $tempAvailabilities = [];
  foreach($row['availability'] AS $value){
    $keyString = "{$value['day']}{$value['start_time']}{$value['stop_time']}";
    $tempAvailabilities[$row['user_id']][$keyString] = $value;
  }
  // $availabilityLookup[ $row['user_id']]['availableDateTimes'] = $tempAvailabilities;
  $row['availability'] = $tempAvailabilities;
  foreach($row['lines'] as $value){
    if(!isset($preferencesLookup[$value])){
      $preferencesLookup[$value] = [];
    }
    $preferencesLookup[$value][] = [
      'userid'=>$row['user_id'],
      'username'=> "{$row['first_name']}{$row['last_name']}",
      'availabilities'=>$tempAvailabilities
    ];
  }
  // $row['availability'] = explode("},", $row['availability']);
  // $row['availability'] = array_unique($row['availability']); 
  // $row['availability'] = implode("},", $row['availability']);

  // $row['availability'] = explode(",{", $row['availability']);
  // $row['availability'] = array_unique($row['availability']);
  // // $row['availability'] = implode(",{", $row['availability']);

  // $bodytag = str_replace("\"", "", $row['availability']);
  // // $bodytag = str_replace('\"{day', '', $bodytag);
  // $row['availability'] = $bodytag;
  // print_r($row);
  $operators[] = $row;
}
print_r($preferencesLookup);
exit();
$operatorsForTesting = json_encode($operators);
print($operatorsForTesting);

//population 3 rounds for each user with line preference
//require 3 line preferences for each operator
//does not handle assignments with block is less than 3 rounds
$lengthOperatorsArray = count($operators);
$lengthRoundsArray = count($rounds);

for($operatorsIndex = 0; $operatorsIndex < $lengthOperatorsArray; $operatorsIndex++) {
  for ($roundsIndex = 0; $roundsIndex < $lengthRoundsArray ; $roundsIndex++) {
    if ($roundsIndex === $lengthRoundsArray -2) {
      break;
    }
    else if ($rounds[$roundsIndex]['user_id'] === '1' and $rounds[$roundsIndex + 1]['user_id'] === '1' and $rounds[$roundsIndex + 2]['user_id'] === '1') {    
      if ($rounds[$roundsIndex]['line_name'] === $rounds[$roundsIndex + 1]['line_name'] and $rounds[$roundsIndex + 1]['line_name'] === $rounds[$roundsIndex + 2]['line_name']) {
        if ($operators[$operatorsIndex]['lines'][0] === $rounds[$roundsIndex]['line_name']){
          // print(date('D',$rounds[$roundsIndex]['date']));
          // print($operators[$operatorsIndex]['availability']['day_of_week']);
          // if($operators[$operatorsIndex]['availability']['day'] === date('D',$rounds[$roundsIndex]['date'])) {
            for ($i  = 0; $i < 3; $i++) {
              $rounds[$roundsIndex + $i]['user_id'] = $operators[$operatorsIndex]['user_id'];
              $rounds[$roundsIndex + $i]['last_name'] = $operators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $i]['first_name'] = $operators[$operatorsIndex]['first_name'];
            }
            if ($operatorsIndex === $lengthOperatorsArray - 1) {
              $operatorsIndex = -1;
            }
            break;
          // }
        } else if ($operators[$operatorsIndex]['lines'][1] === $rounds[$roundsIndex]['line_name']){
            for ($i  = 0; $i < 3; $i++) {
              $rounds[$roundsIndex + $i]['user_id'] = $operators[$operatorsIndex]['user_id'];
              $rounds[$roundsIndex + $i]['last_name'] = $operators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $i]['first_name'] = $operators[$operatorsIndex]['first_name'];
            }
            if ($operatorsIndex === $lengthOperatorsArray - 1) {
              $operatorsIndex = -1;
            }
            break;
        } else if ($operators[$operatorsIndex]['lines'][2] === $rounds[$roundsIndex]['line_name']){
            for ($i  = 0; $i < 3; $i++) {
              $rounds[$roundsIndex + $i]['user_id'] = $operators[$operatorsIndex]['user_id'];
              $rounds[$roundsIndex + $i]['last_name'] = $operators[$operatorsIndex]['last_name'];
              $rounds[$roundsIndex + $i]['first_name'] = $operators[$operatorsIndex]['first_name'];
            }
            if ($operatorsIndex === $lengthOperatorsArray - 1) {
              $operatorsIndex = -1;
            }
            break;
        } else {
          if ($operatorsIndex === $lengthOperatorsArray - 1) {
            $operatorsIndex = -1;
          }
          break;
        }
      } else {
        if ($operatorsIndex === $lengthOperatorsArray - 1) {
          $operatorsIndex = -1;
        }
      }
    }
  }
}

// $rounds = json_encode($rounds);
// print("\n". $rounds);


?>