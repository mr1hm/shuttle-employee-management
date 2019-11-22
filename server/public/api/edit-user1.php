<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$uciNetId = intval($data['uci_net_id']);
$lastName = $data['last_name'];
$firstName = $data['first_name'];
$role = $data['role'];
$status = $data['status'];
$specialRouteOK = intval($data['special_route_ok']);

  $editUserQuery = "UPDATE user 
                    SET last_name = '$lastName',
                    first_name = '$firstName',
                    role = '$role',
                    status = '$status',
                    special_route_ok = '$specialRouteOK'
                    WHERE uci_net_id = '$uciNetId'";

  $result = mysqli_query($conn, $editUserQuery);
  if(!$result){
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }
?>