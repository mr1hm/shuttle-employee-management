<?php
require_once('../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$query = "SELECT t.`id`, t.`user_id`, t.`target_user_id`, t.`date` as request_date, t.`type`, t.`comment`, t.`status`,
r.`user_id`, r.`date` as shift_date, r.`start_time`, r.`end_time`, r.`bus_info_id`, r.`id` as 'round_id',
bi.`bus_number`,
          (
            SELECT `line_name`
            FROM `route`
            WHERE `id` = bi.`route_id`
          ) as 'line_name'
          FROM `transaction` as t
          JOIN `round` as r
          ON  t.`round_id` = r.`id`
          JOIN `bus_info` AS bi
          ON r.`bus_info_id` = bi.`id`
          WHERE `target_user_id` = $user[userId] AND t.`status` = 'pending' AND t.`type` != 'swap-confirm'";


$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception("Sql error" . mysqli_error($conn));
}

$output = [];

if($result = $mysqli->query($query)) {
  while($row = $result->fetch_assoc()) {
    $output[] = $row;
  }

  send($output);
} else {
  throw new ApiError(null, 500, 'Error retrieving user notifications');
}
