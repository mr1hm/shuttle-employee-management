<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

// if (!empty($_GET['startTime'])) {
//   $startTime = $_GET['startTime'];
//   if ($startTime < 600) {
//     throw new Exception('start time is too early');
//   }
//   $startTime = intval($startTime);
// }

// $round_date= $_GET['round_date'];

$query = "SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`round_date`,
            rd.`status`,
            rt.`line_name`,
            rt.`id`
          FROM
            `round` AS rd
          INNER JOIN
            `route` AS rt
          ON
            rd.`bus_info_id` = rt.`id`
          WHERE
            rd.`status`= 'scheduled' || rd.`status` = 'posted'";


$result = mysqli_query($conn, $query);
if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}
print(json_encode($data));

?>
