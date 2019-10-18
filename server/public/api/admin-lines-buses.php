<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET'){

$query = "SELECT
              bi.`bus_number`,
              rt.`id` AS 'route_id',
              bi.`start_time`,
              bi.`end_time`,
              rt.`line_name`,
              rt.`status`,
              rt.`opening_duration`,
              rt.`closing_duration`,
              rt.`public`,
              rt.`regularService`,
              IF (rt.`public` = 1, 'True', 'False') as public,
              IF (rt.`regularService` = 1, 'True', 'False') as regularService
              FROM
              `route` AS rt
              LEFT JOIN
              `bus_info` AS bi
              ON
              bi.`route_id` = rt.`id`
            WHERE  rt. `status` = 'active'
            ORDER BY line_name";


} else if ($method === 'POST') { // change condition to better fit add bus method.

    $line_name = $_POST['line_name'];
    $status = $_POST['active'];
    $public = $_POST['public'];
    $regularService = $_POST['regular_service'];
    $opening_duration = 30;
    $closing_duration = 20;
    $query = "INSERT INTO `route` (`status`, `line_name`, `opening_duration`, `closing_duration`, `public`, `regularService`)
  values ('$status', '$line_name', '$opening_duration', '$closing_duration', '$public', '$regularService') ";

}

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}


$data = [];
while($row = mysqli_fetch_assoc($result)){
    $routeId = $row['route_id'];
    //var_dump($row['bus_number']);
    if($row['bus_number']!==NULL){
        $busInfo = [];
        $busInfo['busNumber'] = $row['bus_number'];
        $busInfo['startTime'] = $row['start_time'];
        $busInfo['endTime'] = $row['end_time']; //I added the data
    }

    unset($row['bus_number']); //so I don't need it here anymore
    unset($row['start_time']);
    unset($row['end_time']);
    if(!isset($data[$routeId])){
      if(isset($busInfo)){
        $row['activeBuses'] = [ $busInfo ];
      } else {
        $row['activeBuses'] = [];
      }
        $data[$routeId] = $row; // double check that $data[] is returning array.
    } else if(isset($busInfo)){
        $data[$routeId]['activeBuses'][] = $busInfo;
    }
}

// $data = [];
// while ($row = mysqli_fetch_assoc($result)) {
//   $data[] = $row;
// }
$data = array_values($data);
print(json_encode($data));

if ($method === 'POST'){
header("Location: http://localhost:3000/admin-routes");

exit();
}

// $row = [
//   'route_id' => 1,
//   'busNumber' => 1,
//   'start' => '0600',
//   'end' => '2300',
//   'line_name' => 'C'
// ];


// $data = [];
// while ($row = mysqli_fetch_assoc($result)) {
//   $routeId = $row['route_id'];
//   $busInfo = [
//     'number' => $row['bus_number'],
//     'start' => $row['start_time'],
//     'end' => $row['end']
//   ];
//   unset($row['busNumber']);
//   unset($row['start']);
//   unset($row['end']);
//   if (!isset($data[$routeId])) {
//     $row['buses'] = [$busInfo];
//     $data[$routeId] = $row;
//   } else {
//     $data[$routeId]['buses'][] = $busInfo;
//   }
// }

?>
