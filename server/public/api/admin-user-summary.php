<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();

  $usersQuery = "SELECT 
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

  $usersResult = mysqli_query($conn, $usersQuery);
  if (!$usersResult) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }
  $usersData = [];
  while ($row = mysqli_fetch_assoc($usersResult)) {
    $usersData[] = $row;
  }

  print(json_encode($usersData));

?>

