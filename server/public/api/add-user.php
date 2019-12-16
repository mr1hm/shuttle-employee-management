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
$phone = $data['phone'];
$email = $data['email'];
$cellProvider = $data['cell_provider'];

function getSessionIds($conn) {
  $sessionIdQuery = "SELECT 
                     id 
                     FROM session";

  $sessionIdResult = mysqli_query($conn, $sessionIdQuery);
  if (!$sessionIdResult) {
  throw new Exception('mysql error ' . mysqli_error($conn));
  }
  $sessionIdData = [];
  while ($row = mysqli_fetch_assoc($sessionIdResult)) {
  $sessionIdData[] = $row;
  }

  return $sessionIdData;
}

function getUserId($conn, $uciNetId) {
  $idQuery = "SELECT id
              FROM user
              WHERE  uci_net_id = $uciNetId";

  $idResult = mysqli_query($conn, $idQuery);
  if (!$idResult) {
  throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $userIdData = [];
  while ($row = mysqli_fetch_assoc($idResult)) {
  $userIdData[] = $row;
  }

  return $userIdData[0]['id'];
}

function addUser($conn, $specialRouteOK, $status, $role, $firstName, $lastName, $uciNetId, $email, $phone, $cellProvider) {
  $addUserQuery = "INSERT INTO user (
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
    $uciNetId,
    '$lastName',
    '$firstName',
    '',
    '',
    '$status',
    '$role',
    '$specialRouteOK',
    '$phone',
    '$email',
    '',
    '$cellProvider',
    '',
    null)";

  $result = mysqli_query($conn, $addUserQuery);
  if(!$result){
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }
}


function addUserToSessionAvailability($conn, $userId, $sessionIdData) {
  $numberUserId = intval($userId);
  for ($index = 0; $index < count($sessionIdData); $index++) {
    $sessionId = intval($sessionIdData[$index]['id']);
    $addSessionAvailQuery = "INSERT INTO operator_session_avail (
      user_id,
      session_id,
      min_avail_hours,
      avail_end_date
      )
      VALUES (
      $numberUserId,
      $sessionId,
      null,
      null)";
    $result = mysqli_query($conn, $addSessionAvailQuery);
    if(!$result){
    throw new Exception('MySQL update error: '.mysqli_error($conn));
    }   
  }
}

$sessionIdData = getSessionIds($conn);
print_r($sessionIdData);
addUser($conn, $specialRouteOK, $status, $role, $firstName, $lastName, $uciNetId, $email, $phone, $cellProvider);
$userId = getUserId($conn, $uciNetId);
print_r($userId);
addUserToSessionAvailability($conn, $userId, $sessionIdData);
?>