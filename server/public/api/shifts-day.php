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
$date = $_GET['date'];

$checkingType = false;
//these were placed under rt. `id` before in place
//Counting how many rounds are scheduled COUNT(`start_time`),
//See if the status types are all the same (scheduled/posted) but only works if there a mix of both COUNT(DISTINCT rd.`status`)
if (!isset($_GET['type']) || $_GET['type'] === 'myShifts') {
  $checkingType = true;
  $query = "SELECT
            rd.`bus_info_id`,
            rd.`user_id`,
            rd.`start_time`,
            rd.`end_time`,
            rd.`date`,
            rt.`line_name`,
            rt.`id`,
            rd. `status`,
            rd.`id` AS roundID

          FROM
            `round` AS rd
          INNER JOIN
            `route` AS rt
          ON
            rd.`bus_info_id` = rt.`id`
          WHERE
rd.`date`= {$date} AND rd.`user_id` = 1";
          // GROUP BY
          //   rd.`bus_info_id`,
          //   rd.`user_id`,
          //   rd.`date`,
          //   rt.`line_name`,
          //   rt.`id`,
          //   rd. `status`";
} else {
  $query = " SELECT
            rd.`id` AS roundID,
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
//conditional for grouping contiguous rounds together by status type
if($checkingType){
  $previousEndTime = '';
  $previousStatus = '';
  $currentDataRow = [];
  while ($row = mysqli_fetch_assoc($result)) {
    if($row['status']!==$previousStatus || $row['start_time'] !== $previousEndTime){
      $data[] = $currentDataRow;
      $currentDataRow = $row;
      $currentDataRow['componentIDs'] = [intVal($row['roundID'])];
      $currentDataRow['startingRoundId'] = intVal($row['roundID']);
      $currentDataRow['roundCount'] = 1;
    } else {
      $currentDataRow['roundCount']++;
      $currentDataRow['componentIDs'][] = [intVal($row['roundID'])];
      $currentDataRow['end_time'] = $row['end_time'];
    }
    $previousEndTime = $row['end_time'];
    $previousStatus = $row['status'];
  }
  array_shift($data);
} else {
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }
}

print(json_encode($data));
?>
