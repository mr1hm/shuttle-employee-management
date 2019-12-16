<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$sessionId = intval($data['session_id']);
$userId = intval($data['user_id']);

function getGeneralParameters($conn, $sessionId) {
  $generalParametersQuery = "SELECT
                             availStartDateString,
                             availEndDateString,
                             min_operator_hours,
                             min_operations_hours,
                             min_trainer_hours,
                             min_trainee_hours
                             FROM session 
                             WHERE 
                             id = $sessionId";

  $result = mysqli_query($conn, $generalParametersQuery);

  if (!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }

  $generalParameters = [];

  while ($row = mysqli_fetch_assoc($result)) {
    $generalParameters[] = $row;
  }
  return $generalParameters;
}

function getRole($conn, $userId) {
  $roleQuery = "SELECT role FROM user WHERE id = $userId";

$result = mysqli_query($conn, $roleQuery);

  if (!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }

  $role = [];

  while ($row = mysqli_fetch_assoc($result)) {
    $role[] = $row;
  }
  return $role;
}

function getIndividualParameters($conn, $userId, $sessionId) {
  $individualParametersQuery = "SELECT
                                min_avail_hours,
                                availEndDateString
                                FROM 
                                operator_session_avail
                                WHERE
                                session_id = $sessionId AND user_id = $userId";

  $result = mysqli_query($conn, $individualParametersQuery);

  if (!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
  }

  $individualParameters = [];

  while ($row = mysqli_fetch_assoc($result)) {
    $individualParameters[] = $row;
  }
  return $individualParameters;
}

function combineParameters($generalParameters, $individualParameters, $role) {
  $roleDetails = ["operator" => "min_operator_hours", "operations" => "min_operator_hours", "trainer" => "min_trainer_hours", "trainee" => "minimum_trainee_hours"];
  $roleType = $role[0]['role'];
  if($individualParameters) {
    if ($individualParameters[0]['availEndDateString']) {
      $generalParameters[0]['availEndDateString'] = $individualParameters[0]['availEndDateString'];
    }
    if ($individualParameters[0]['min_avail_hours']) {
      $generalParameters[0][$roleDetails[$roleType]] = $individualParameters[0]['min_avail_hours'];
    }
  }
  $generalParameters[0]['role'] = $role[0]['role'];
  
  print(json_encode($generalParameters));
}

$generalParameters = getGeneralParameters($conn, $sessionId);
$individualParameters = getIndividualParameters($conn, $userId, $sessionId);
$role = getRole($conn, $userId);
combineParameters($generalParameters, $individualParameters, $role);
?>