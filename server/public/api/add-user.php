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

function addUser($conn, $specialRouteOK, $status, $role, $firstName, $lastName, $uciNetId) {
  print($lastName);
  $addUserQuery = "INSERT INTO user (
    id,
    uci_net_id,
    last_name,
    first_name,
    nickname,
    photo,
    status,
    role,
    special_route_ok,
    phone,
    email,
    shirt_size,
    cell_provider,
    url,
    last_update)
    VALUES (
    null,
    $uciNetId,
    '$lastName',
    '$firstName',
    '',
    '',
    '$status',
    '$role',
    '$specialRouteOK',
    0,
    '',
    '',
    '',
    '',
    null)";

  $result = mysqli_query($conn, $addUserQuery);
  if(!$result){
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }
}

addUser($conn, $specialRouteOK, $status, $role, $firstName, $lastName, $uciNetId);

?>