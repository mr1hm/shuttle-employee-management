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

$rounds = json_encode($rounds);

print($rounds);

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
    $operators[] = $row;
}

$operators = json_encode($operators);

print($operators);

//population 3 round for each user, no line or availability preferences
$lengthOperatorsArray = count($operators);
$lengthRoundsArray = count($rounds);

for ($i = 0; $i < $lengthOperatorsArray; $i++) {
  for ($j = $i * 3; $j < $i * 3 + 3; $j++) {
    if ($j < $lengthRoundsArray) {
    $rounds[$j]['user_id'] = $operators[$i]['user_id'];
    $rounds[$j]['last_name'] = $operators[$i]['last_name'];
    $rounds[$j]['first_name'] = $operators[$i]['first_name'];
    } else {
      break;
    }
  }
  if ($i === $lengthOperatorsArray - 1) {
    $i = -1; 
    continue;
}
  
print($rounds);

//PSEUDOCODE AND DUMMY ARRAY WORK

//QUERY to obtain operator route preference (lines he/she won't work) and availability based on a particular session
  //store as an array of objects (operatorAvailability)
  //each object (one for each driver) will include: 
    //user.id (will dictate the placement in the array)
    //user.last_name
    //user.first_name
  //no_route_preference_line (routes operator refuses to drive -- store in an array)
    //route.line_name (will have to query this through operator_route_preference to get to line)
  //operator_availability days and times (store each block as an object)
    //operator_availability.day_of_week
    //operator.start_time
    //operator.end_time


//CREATE an array to hold operator route preference (lines he/she won't work) and availability based on a particular session
    // $operators = [["user_id"=> 2345, "last_name"=> "Smith", "first_name"=> "Fred", "line_preference"=> ['M','N'], "availability"=> [["day"=> "mon", "start_time"=>0600, "end_time" => 1000], ["day"=> "wed", "start_time"=>1400, "end_time"=> 1800], ["day"=> "fri", "start_time"=>1400, "end_time"=> 1800]]], ["user_id"=> 1234, "last_name"=> "Wu", "first_name"=> "Vicky", "line_preference"=> ['K','L'], "availability"=> [[day=> sat, "start_time"=>0900, "end_time"=> 1300], ["day"=> sat, "start_time"=>1500, "end_time"=> 1800], ["day"=> tue, "start_time"=>1400, "end_time"=> 1800]]]];

//QUERY to get all available rounds 
  //route.line
  //bus_info.bus_number
  //round.day
  //round.start_time
  //round.end_time
  //user_id (will start at null)
  //first_name (will start at null)
  //last_name (will start at null)

//CREATE an array to store all available rounds 
  //$rounds = [{"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0610: "end_time": 0630, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0630: "end_time": 0650, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0650: "end_time": 0710, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0710: "end_time": 0730, "user_id": null, "first_name": null, "last_name": null}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0730: "end_time": 0750, "user_id": null, "first_name": null, "last_name": null}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0750: "end_time": 0810, "user_id": null, "first_name": null, "last_name": null}];

//SET minimum number of rounds per assignment -- will likely be different for each route. For preliminary testing set it to 3.

//ASSIGNMENT ONLY, NO AVAIL, OR PREF -- just placing people into shifts with not preferences and no availability

  //increment to the first person in the operators array 
  //assign hours for the first three rounds (indexes) in the rounds array to that person
  //move to the next person in the operators array
  //assign hours for the next three rounds (indexes) in the rounds array to that person
  //move to the third person in the operators array
  //assign hours for the next three rounds (indexes) in the rounds array to that person
  //continue until you reach the end of the operators array and then return to the beginning of that array and continue to loop through that array until all all the elements in the rounds array have been assigned.

//OTHER STUFF


//make an array of all the users that could meet assignment (available to work the shift, not a no preference)
//sort that array based on hours assigned
//populate the top person into the space

//repeat for each round

//before any assignments are made
//$operatorAvailability = [{"user_id"=> 2345, "last_name"=> "Smith", "first_name"=> "Fred", "route_preference"=> [4,6], "availability"=> [{"day"=> "mon", "start_time"=>0600, "end_time" => 1000}, {"day"=> "wed", "start_time"=>1400, "end_time"=> 1800}, {"day"=> "fri", "start_time"=>1400, "end_time"=> 1800}]}, {"user_id"=> 1234, "last_name"=> "Wu", "first_name"=> "Vicky", "no_route_preference"=> [1,3], "availability"=> [{day=> sat, "start_time"=>0900, "end_time"=> 1300}, {"day"=> sat, "start_time"=>1500, "end_time"=> 1800}, {"day"=> tue, "start_time"=>1400, "end_time"=> 1800}]}]

//during assigning process (computer has only made it through first three rounds of D line for Mondays)
//$roundAssignment = [{"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0610: "end_time": 0630, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0630: "end_time": 0650, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0650: "end_time": 0710, "user_id": 2345, "first_name": "Fred", "last_name": "Smith"}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0710: "end_time": 0730, "user_id": null, "first_name": null, "last_name": null}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0730: "end_time": 0750, "user_id": null, "first_name": null, "last_name": null}, {"line": "D", "bus_number": "1", "day_of_week": "mon", "start_time" 0750: "end_time": 0810, "user_id": null, "first_name": null, "last_name": null}];

//after the first three rounds on Monday have been assigned to Fred Smith.
//$operatorAvailability = [{"user_id": 2345, "last_name": "Smith", "first_name": "Fred", "route_preference": [4,6], "availability": [{"day": "mon", "start_time":0710, "end_time:" 1000}, {"day": "wed", "start_time":1400, "end_time": 1800}, {"day": "fri", "start_time":1400, "end_time": 1800}]}, {"user_id": 1234, "last_name": "Wu", "first_name": "Vicky", "no_route_preference": [1,3], "availability": [{day: sat, "start_time":0900, "end_time": 1300}, {"day": sat, "start_time":1500, "end_time": 1800}, {"day": tue, "start_time":1400, "end_time": 1800}]}];


//$availableOperators = [];
//assign an operator to a shift
//remove those shifts from their availability

?>