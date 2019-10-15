<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET'){

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
              `route` AS rt
              INNER JOIN
            `bus_info` AS bi
              ON
           bi.`route_id`  = rt.`id`
            WHERE  rt. `status` ='active'
            ORDER BY line_name";


} else if ($method === 'POST') {

    $line_name = $_POST['line_name'];
    $status = $_POST['active'];
    $opening_duration = 30;
    $closing_duration = 20;
    $query = "INSERT INTO `route` (`status`, `line_name`, `opening_duration`, `closing_duration`)
  values ('$status', '$line_name', '$opening_duration', '$closing_duration') ";

}

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode($data));

if ($method === 'POST'){
header("Location: http://localhost:3000/admin-routes");

exit();
}
?>
