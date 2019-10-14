<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

// if(!empty($_GET['unix_timestamp'])){
//   $timestamp = $_GET['unix_timestamp'];
//   if (!is_numeric($timestamp)) {
//     throw new Exception('This is not a unix timestamp. Please enter a valid unix timestamp.');
//   }
//   $timestamp = intval($timestamp);
// }

//Change the 1566172886400 on line 22 to {$timestamp} when you are ready to connect.

//Will be adding additional query functionality so the drive name populates.

$query = "SELECT rt.line, bi.bus_number, rd.status, us.last_name, us.first_name,
  rd.start_time AS round_start, 
  rd.end_time AS round_end 
  FROM route AS rt 
  JOIN bus_info AS bi ON bi.route_id = rt.id 
  JOIN round AS rd ON rd.bus_id = bi.id
  JOIN user AS us ON us.id = rd.user_id 
  WHERE rd.round_date = 1566172886400";

$result = mysqli_query($conn, $query);

if(!$result){
  throw new Exception('MySQL error: '.mysqli_error($conn));
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

print(json_encode($data));
?>