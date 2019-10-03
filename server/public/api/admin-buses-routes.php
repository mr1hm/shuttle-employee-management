<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$checkingType = false;
if ($method === 'GET'){
  $checkingType = true;
$query = "SELECT
              bi.`bus_number`,
              bi.`route_id`,
              bi.`start_time`,
              bi.`end_time`,
              rt.`line_name`,
              rt.`status`,
              rt.`opening_duration`,
              rt.`closing_duration`
              FROM
              `bus_info` AS bi
              INNER JOIN
            `route` AS rt
          ON
            rt.`id` = bi.`route_id`
            WHERE  rt. `status` ='active'
            ORDER BY line_name";
}


$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

$data = [];
// conditional for grouping same lines together by line name
// if ($checkingType) {
//   $previousLine = '';
//   $currentDataRow = [];
//   while ($row = mysqli_fetch_assoc($result)) {
//     if ($row['line_name'] !== $previousLine) {
//       $data[] = $currentDataRow;
//       $currentDataRow = $row;
//     } else {

//     }
//     $previousLine = $row['line_name'];
//   }
//   $data[] = $currentDataRow;
//   array_shift($data);
// } else {
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }
// }


// while ($row = mysqli_fetch_assoc($result)) {
//   $data[] = $row;
// }
print(json_encode($data));
?>
