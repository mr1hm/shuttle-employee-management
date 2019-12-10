<?php

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
require_once(DATES);
set_tz_la();

  $user = getRequestUser();

  if(!$user) {
    throw new ApiError(null, 401, 'Not Authorized');
  }

  $startDate = getLast('Sunday');
  $endDate = getNext('Saturday');

  if(isset($_GET['startDate']) && $_GET['endDate']) {
    $startDate = $_GET['startDate'];
    $endDate = $_GET['endDate'];
  }

  $stmt = $mysqli->prepare("SELECT
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
          WHERE `user_id`= ? AND (`date` >= ? AND `date` <= ?)
          ORDER BY `date`, `start_time` ASC");

  $stmt->bind_param('iss', $user['userId'], $startDate, $endDate);
  $stmt->execute();

  $result = $stmt->get_result();

  if(!$result){
    throw new ApiError(null, 500, 'Error getting week\'s schedule');
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

  send($data);
