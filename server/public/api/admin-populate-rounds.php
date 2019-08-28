<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$query = "SELECT rt.line_name, bi.bus_number, 
rd.start_time AS round_start, 
rd.end_time AS round_end,
us.id AS user_id, 
us.last_name, 
us.first_name
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
    $rounds[] = $row;
}

// $rounds = json_encode($rounds);

// print($rounds);

//only includes user info and route preferences
$query2 = "SELECT orp.user_id, us.last_name, us.first_name, GROUP_CONCAT(rt.line_name) AS `lines`
FROM operator_route_preference AS orp
JOIN route AS rt ON orp.route_id = rt.id 
JOIN user AS us ON orp.user_id = us.id 
WHERE orp.session_id = 1
GROUP BY orp.user_id";

$result2 = mysqli_query($conn, $query2);

if(!$result2){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$operators = [];

while ($row = mysqli_fetch_assoc($result2)) {
  $row['lines'] = explode(",", $row['lines']);
  $operators[] = $row;
}

// $operatorsForTesting = json_encode($operators);

// print($operatorsForTesting);

// population 3 rounds for each user with line preference
// require 3 line preferences for each operator
// does not handle assignments with block is less than 3 rounds
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
          for ($i  = 0; $i < 3; $i++) {
            $rounds[$roundsIndex + $i]['user_id'] = $operators[$operatorsIndex]['user_id'];
            $rounds[$roundsIndex + $i]['last_name'] = $operators[$operatorsIndex]['last_name'];
            $rounds[$roundsIndex + $i]['first_name'] = $operators[$operatorsIndex]['first_name'];
          }
          if ($operatorsIndex === $lengthOperatorsArray - 1) {
            $operatorsIndex = -1;
          }
          break;
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

$rounds = json_encode($rounds);
print("\n". $rounds);

?>