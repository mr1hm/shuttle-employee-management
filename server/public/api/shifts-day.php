<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
require_once(DATES);
set_tz_la();

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$date = getToday();

if(isset($_GET['date'])) {
  $date = $_GET['date'];
}

$checkingType = false;
//these were placed under rt. `id` before in place
//Counting how many rounds are scheduled COUNT(`start_time`),
//See if the status types are all the same (scheduled/posted) but only works if there a mix of both COUNT(DISTINCT rd.`status`)
if (!isset($_GET['type']) || $_GET['type'] === 'myShifts') {
  $checkingType = true;
  $statement = $mysqli->prepare("SELECT
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
          WHERE
            rd.`date`= ? AND rd.`user_id` = ?");
          // GROUP BY
          //   rd.`bus_info_id`,
          //   rd.`user_id`,
          //   rd.`date`,
          //   rt.`line_name`,
          //   rt.`id`,
          //   rd. `status`";
} else {
  $statement = $mysqli->prepare(" SELECT
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
            rd.`date`= ?
            AND rd.`status` = 'posted' AND rd.`user_id` != ?");
}
if ($statement == FALSE){
  throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('si', $date, $user['userId'])){
  throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
  throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result === FALSE) {
  throw new ApiError(null, 500, 'Error retrieving shift data');
}

$data = [];
<<<<<<< HEAD
while ($row = mysqli_fetch_assoc($result)) {
=======
//conditional for grouping contiguous rounds together by status type
if($checkingType){
  $previousEndTime = '';
  $previousStatus = '';
  $currentDataRow = [];
  while ($row = $result->fetch_assoc()) {
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
  $data[] = $currentDataRow;
  array_shift($data);
} else {
  while ($row = $result->fetch_assoc()) {
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
    $data[] = $row;
}
<<<<<<< HEAD
print(json_encode($data));

=======

send($data);
>>>>>>> 2104ba19b95d2356742687f48d902a6831e8d25d
?>
