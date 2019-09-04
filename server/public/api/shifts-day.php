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

// $userID = $_GET['user_id'];
$date= $_GET['date'];

if (!isset($_GET['type']) || $_GET['type'] === 'myShifts'){
  $query = "SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            MIN(`start_time`),
            MAX(`end_time`),
            rd.`date`,
            rd. `status`,
            rt.`line_name`,
            rt.`id`,
            COUNT(`start_time`)
          FROM
            `round` AS rd
          INNER JOIN
            `route` AS rt
          ON
            rd.`bus_info_id` = rt.`id`
          WHERE
            rd.`date`= {$date} AND rd.`user_id` = 1 AND rd. `status` = 'scheduled' OR 'posted'
          GROUP BY
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`date`,
            rd.`status`,
            rt.`line_name`,
            rt.`id`";
} else {
  $query = " SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`date`,
            rd. `status`,
            rt.`line_name`,
            rt.`id`
          FROM
            `round` AS rd
          INNER JOIN
            `route` AS rt
          ON
            rd.`bus_info_id` = rt.`id`
          WHERE
            rd.`date`= {$date}
            AND rd.`status` = 'posted' AND rd.`user_id` != 1";
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
?>
