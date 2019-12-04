<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
if (!empty($_GET['id'])) {
  $id = $_GET['id'];
  if (!is_numeric($id)) {
    throw new Exception('id needs to be a number');
  }
  $id = intval($id);
}
$startDate = $_GET['startDate'];
$endDate = $_GET['endDate'];

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
          WHERE `user_id`= {$id} AND (`date` >= '$startDate' AND `date` <= '$endDate')
ORDER BY `date`, `start_time` ASC";

$result = mysqli_query($conn, $query);

  if(!$result){
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  $previousEndTime = '';
  $previousStatus = '';
  $previousDate = '';
  $currentDataRow = [];
  while ($row = mysqli_fetch_assoc($result)) {
    if ($row['date'] !== $previousDate || $row['start_time'] !== $previousEndTime) {
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
    $previousDate = $row['date'];
  }
  $data[] = $currentDataRow;

  // while($row = mysqli_fetch_assoc($result)){

  //   $row['posted'] = $row['status'] === 'posted' ? true: false;
  //   unset($row['status']);
  //   $data[] = $row;
  // }

print(json_encode($data));
