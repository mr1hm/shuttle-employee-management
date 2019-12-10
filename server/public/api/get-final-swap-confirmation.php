<?php

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user){
  throw new ApiError(null, 401, 'Not Authorized');
}

$query = "SELECT
  t.`id`, t.`user_id`, t.`target_user_id`, t.`date` as request_date, t.`type`, t.`comment`, t.`status`,
  r.`user_id`, r.`date` as shift_date, r.`start_time`, r.`end_time`, r.`bus_info_id`, r.`id` as round_id,
  (
    SELECT `line_name`
    FROM `route`
    WHERE `id` = r.`bus_info_id`
  ) as line_name
  FROM `transaction` as t
  JOIN `round` as r ON  t.`round_id` = r.`id`
  WHERE `target_user_id` = ?
  AND t.`status` = 'pending'
  AND t.`type` = 'swap-confirm'";

$statement = $mysqli->prepare($query);
if ($statement == FALSE){
  throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('i', $user['userId'])){
  throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
  throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result == FALSE){
  throw new ApiError(null, 500, 'Error retrieving final swap confirmations');
}

$output = [];
while($row = $result->fetch_assoc()) {
  $output[] = $row;
}

$query2 = "SELECT t.`id`, t.`user_id`, t.`target_user_id`, t.`date` as request_date, t.`type`, t.`comment`, t.`status`,
          r.`user_id`, r.`date` as shift_date, r.`start_time`, r.`end_time`, r.`bus_info_id`, r.`id` as round_id,
          (
            SELECT `line_name`
            FROM `route`
            WHERE `id` = r.`bus_info_id`
          ) as line_name
          FROM `transaction` as t
          JOIN `round` as r
          ON  t.`target_round_id` = r.`id`
          WHERE `target_user_id` = $user[userId] AND t.`status` = 'pending' AND t.`type` = 'swap-confirm'";

if($result2 = $mysqli->query($query2)) {
  while ($newRow = $result2->fetch_assoc()) {
    $output[] = $newRow;
  }

  send($output);
  exit;
}

throw new ApiError(null, 500, 'Error retrieving final swap confirmations');
