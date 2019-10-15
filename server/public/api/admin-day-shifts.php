<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

// $date= $_GET['date'];

// $date = 1566273600;

$query = "SELECT
          rd.id AS round_id,
          rt.line_name,
          bi.bus_number,
          rd.start_time AS round_start,
          rd.end_time AS round_end,
          us.id AS user_id,
          us.last_name,
          us.first_name,
          rd.date,
          rd.status
          FROM route AS rt
          JOIN bus_info AS bi ON bi.route_id = rt.id
          JOIN round AS rd ON rd.bus_info_id = bi.id
          JOIN user AS us ON rd.user_id = us.id
          WHERE rd.date = 1566100800
          ORDER BY line_name ASC, bus_number ASC, round_start ASC";

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