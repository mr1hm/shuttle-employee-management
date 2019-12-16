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
$minAvailHours = intval($data['min_avail_hours']);
$availEndDate = $data['availEndDateString'];
$sessionId = intval($data['session_id']);

function userId($conn, $uciNetId) {
  $userIdQuery = "SELECT id
                  FROM user
                  WHERE user.uci_net_id = '$uciNetId'";

  $userIdResult = mysqli_query($conn, $userIdQuery);
  if (!$userIdResult) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }
  $userIdData= [];
  while ($row = mysqli_fetch_assoc($userIdResult)) {
    $userIdData[] = $row;
  }
  return $userIdData[0]['id'];
}

function updateUser($conn, $userId, $lastName, $firstName, $role, $status, $specialRouteOK) {
  $editUserQuery = "UPDATE user 
  SET last_name = '$lastName',
  first_name = '$firstName',
  role = '$role',
  status = '$status',
  special_route_ok = '$specialRouteOK'
  WHERE id = $userId";

  $result = mysqli_query($conn, $editUserQuery);

  if(!$result) {
    throw new Exception('MySQL update error: '.mysqli_error($conn));
  }
}

function updateSessionAvailability($conn, $userId, $sessionId, $minAvailHours, $availEndDate) {
  $editAvailability = "UPDATE operator_session_avail 
                       SET  min_avail_hours = '$minAvailHours',
                       availEndDateString = '$availEndDate'
                       WHERE session_id = '$sessionId' 
                       AND user_id = '$userId'";

  $result = mysqli_query($conn, $editAvailability);

  if(!$result) {
    throw new Exception('MySQL update error: '.mysqli_error($conn));
  }

}

$userId = userId($conn, $uciNetId);
updateUser($conn, $userId, $lastName, $firstName, $role, $status, $specialRouteOK);
updateSessionAvailability ($conn, $userId, $sessionId, $minAvailHours, $availEndDate);
?>