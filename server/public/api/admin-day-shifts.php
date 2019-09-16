<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$date= $_GET['date'];

$query = "SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`date`,
            rd.`status`,
            rt.`line_name`,
            rt.`id`,
            bi.`start_time` AS busStart,
            bi.`end_time` AS busEnd
          FROM
            `round` AS rd
          INNER JOIN
            `route` AS rt
          ON
            rd.`bus_info_id` = rt.`id`
          INNER JOIN
            bus_info bi
          ON
            rd.`bus_info_id` = bi.`bus_number`
          WHERE
            rd.`date`= {$date}";


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