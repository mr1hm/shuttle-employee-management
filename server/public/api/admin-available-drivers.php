<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

// $date= $_GET['date'];

$query = "SELECT
            us.`first_name`,
            us.`last_name`,
            us.`status`,
            us.`role`,
            us.`id`,
            oa.`user_id`,
            oa.`day_of_week`,
            oa.`start_time`,
            oa.`end_time`
          FROM
            `user` AS us
          INNER JOIN
            `operator_availability` AS oa
          ON
            us.`id` = oa.`user_id`
          WHERE
            us.`status` = 'active' AND
            us.`role` = 'operator'";



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