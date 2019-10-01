<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

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
            WHERE  rt. `status` ='active'";


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
