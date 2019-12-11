<?php

require(__DIR__.'/../../lib/startup.php');

$usersQuery = "SELECT
              id,
              uci_net_id,
              last_name,
              first_name,
              role,
              status,
              special_route_ok,
              phone,
              email,
              cell_provider
              FROM user
              WHERE id != 1
              ORDER BY
              last_name ASC";

$result = $mysqli->query($usersQuery);
if ($result === FALSE) {
  throw new ApiError(NULL, 500, 'Error retrieving users');
}

$response = [];
while ($row = $result->fetch_assoc()) {
  $response[] = $row;
}

send($response);
