<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$date= $_GET['date'];
$start_time = $_GET['start_time'] ?? false;
// $day_of_week = $_GET['day_of_week'];
// $start_time= $_GET['start_time'];
$start_time_filter = $start_time ? "AND rd.`start_time` != {$start_time}" : "";
$query = "SELECT
            us.`first_name`,
            us.`last_name`,
            us.`status`,
            us.`role`,
            us.`id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`date`,
            rd.`status` AS shift_status,
            rd.`user_id`
          FROM
            `round` AS rd
          INNER JOIN
          `user` AS us
          ON
            us.`id` = rd.`user_id`
          WHERE
            us.`status` = 'active' 
            AND us.`role` = 'operator' 
            AND rd.`date` = {$date} 
            $start_time_filter
          ORDER BY
            us.`id` ASC";



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