<?php

require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$session = intval($data['session_id']);

// function OK
function getOperatorsWithSubmittedAvailability($conn, $session) {
  $operatorsWithAvailabilityQuery = "SELECT 
                                     us.uci_net_id
                                     FROM operator_availability AS oa 
                                     INNER JOIN user AS us 
                                     ON us.id = oa.user_id 
                                     WHERE status = 'active' AND us.role != 'admin' AND us.role != 'super_admin' AND oa.session_id = $session";

  $opsAvailabilityResult = mysqli_query($conn, $operatorsWithAvailabilityQuery);
  if (!$opsAvailabilityResult) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }
  $opsAvailabilityData = [];
  while ($row = mysqli_fetch_assoc($opsAvailabilityResult)) {
    $opsAvailabilityData[] = $row;
  }

  return $opsAvailabilityData;
}

// function OK
function getAllActiveOperators($conn) {
  $allActiveOperatorsQuery = "SELECT 
                              us.uci_net_id,
                              us.first_name, 
                              us.last_name,                                     
                              us.role,
                              us.status,
                              us.special_route_ok,
                              osa.min_avail_hours,
                              osa.avail_end_date
                              FROM user AS us
                              JOIN operator_session_avail AS osa ON us.id = osa.user_id
                              WHERE us.role != 'admin' AND us.role != 'super_admin'";

  $allActiveResult = mysqli_query($conn, $allActiveOperatorsQuery);
  if (!$allActiveResult) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }
  $allActiveData = [];
  while ($row = mysqli_fetch_assoc($allActiveResult)) {
    $row['submitted'] = 0;
    $allActiveData[] = $row;
  }

  return $allActiveData;
}

// function OK
function getSessionAvailabilityDetails($conn, $session) {
  $sessionQuery = "SELECT
                   min_operator_hours,
                   min_operations_hours,
                   min_trainer_hours,
                   min_trainee_hours,
                   avail_end_date
                   FROM session
                   WHERE id = $session";

$sessionAvailabilityResult = mysqli_query($conn, $sessionQuery);
if (!$sessionAvailabilityResult) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$sessionAvailabilityData = [];
while ($row = mysqli_fetch_assoc($sessionAvailabilityResult)) {
  $sessionAvailabilityData[] = $row;
}

return $sessionAvailabilityData;
}

// function OK
function submissionStatus($allActiveData, $opsAvailabilityData) {
  for ($index = 0; $index < count($allActiveData); $index++) {
    $flag = 0;
    for ($avIndex = 0; $avIndex  < count($opsAvailabilityData); $avIndex++) {
      if ($allActiveData[$index]['uci_net_id'] === $opsAvailabilityData[$avIndex]['uci_net_id']){
        $flag = true;
        break;
      }
    }
    if ($flag) {
      $allActiveData[$index]['submitted'] = 1;
    }
  }
  return $allActiveData;
}

function populateDefaults($submissionStatusData, $sessionAvailabilityData) {
  for($index = 0; $index < count($submissionStatusData); $index++) {
    if(!$submissionStatusData[$index]['min_avail_hours']) {
       if($submissionStatusData[$index]['role'] === 'operator') {
         $submissionStatusData[$index]['min_avail_hours'] = $sessionAvailabilityData[0]['min_operator_hours'];
       } else if($submissionStatusData[$index]['role'] === 'operations') {
         $submissionStatusData[$index]['min_avail_hours'] = $sessionAvailabilityData[0]['min_operations_hours'];
       } else if($submissionStatusData[$index]['role'] === 'trainer') {
         $submissionStatusData[$index]['min_avail_hours'] = $sessionAvailabilityData[0]['min_trainer_hours'];
       } else if($submissionStatusData[$index]['role'] === 'trainee') {
         $submissionStatusData[$index]['min_avail_hours'] = $sessionAvailabilityData[0]['min_trainee_hours'];
       }
     }
     if(!$submissionStatusData[$index]['avail_end_date']) {
       $submissionStatusData[$index]['avail_end_date'] = $sessionAvailabilityData[0]['avail_end_date'];
     }
   }
   print(json_encode($submissionStatusData));
}


$allActiveData = getAllActiveOperators($conn);
$opsAvailabilityData = getOperatorsWithSubmittedAvailability($conn, $session);
$sessionAvailabilityData = getSessionAvailabilityDetails($conn, $session);
$submissionStatusData = submissionStatus($allActiveData, $opsAvailabilityData);
populateDefaults($submissionStatusData, $sessionAvailabilityData);
?>

