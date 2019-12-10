<?php //http_response_code(501); exit(); // TODO: security check

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$query = "SELECT
  t.`id`, t.`user_id`, t.`target_user_id`, t.`date` AS request_date, t.`type`, t.`comment`, t.`status`,
  r.`user_id`, r.`date` AS shift_date, r.`start_time`, r.`end_time`, r.`bus_info_id`, r.`id` AS 'round_id',
  bi.`bus_number`,
  (
    SELECT `line_name`
    FROM `route`
    WHERE `id` = bi.`route_id`
  ) as 'line_name'
  FROM `transaction` AS t
  JOIN `round` AS r ON  t.`round_id` = r.`id`
  JOIN `bus_info` AS bi ON r.`bus_info_id` = bi.`id`
  WHERE `target_user_id`= ?
  AND t.`status` = 'pending'
  AND t.`type` != 'swap-confirm'";

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
  throw new ApiError(null, 500, 'Error retrieving user notifications');
}

$output = [];
while($row = $result->fetch_assoc()) {
  $output[] = $row;
}
send($output);
