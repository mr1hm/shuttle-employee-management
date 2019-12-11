<?php

require_once(__DIR__.'/../../lib/startup.php');

$usersQuery = 'SELECT u.id, uci_net_id, last_name, first_name, status, special_route_ok, phone, email, cell_provider
	FROM user AS u
  LEFT JOIN user_roles AS ur ON u.id=ur.user_id
  LEFT JOIN roles AS r ON ur.role_id=r.id
  WHERE r.mid != "super_admin" OR ur.role_id IS NULL
  GROUP BY u.id, uci_net_id, last_name, first_name, status, special_route_ok, phone, email, cell_provider
  ORDER BY last_name ASC';

$result = $mysqli->query($usersQuery);
if ($result === FALSE) {
  throw new ApiError(NULL, 500, 'Error retrieving users');
}

$response = [];
while ($row = $result->fetch_assoc()) {
  $response[] = $row;
}

send($response);
