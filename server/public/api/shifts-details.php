<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

if (!empty($_GET['user_id'])) {
  $userID = intval($_GET['user_id']);
} else throw new Exception('need id for query');

if (!empty($_GET['unixdate'])) {
  $unixDate = $_GET['unixdate'];
} else throw new Exception('need unix date of the shift for query');

if (!empty($_GET['start_time'])) {
  $shiftStartTime = intval($_GET['start_time']);
} else throw new Exception('need the shift block start time for query');

if (!empty($_GET['end_time'])) {
  $shiftEndTime = intval($_GET['end_time']);
} else throw new Exception('need the shift block end time for query');

$query = "SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`date`,
            rt.`line_name`,
            rt.`id`,
            bi.`route_id`,
            bi.`bus_number`,
            bi.`id`,
            rd. `status`,
            rd.`id` AS roundID
          FROM
            `round` AS rd
          INNER JOIN
          	`bus_info` as bi
            ON
            rd.`bus_info_id` = bi.`id`
          INNER JOIN
            `route` AS rt
          ON
            rt.id = bi.`route_id`
          WHERE `user_id` = {$userID}
          AND `date` = '$unixDate'
          AND (rd.`start_time` >= {$shiftStartTime} AND rd.`end_time` <= {$shiftEndTime})

          ORDER BY rd.`start_time` ASC";

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
