<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$session = $data['session_id'];

function getOperatorsWithSubmittedAvailability($conn, $session) {
  $operatorsWithAvailabilityQuery = "SELECT 
                                     us.id, 
                                     us.first_name, 
                                     us.last_name
                                     FROM operator_availability AS oa 
                                     INNER JOIN user AS us 
                                     ON us.id = oa.user_id 
                                     WHERE us.status = 'active' AND us.role = 'operator' AND oa.session_id = $session";

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

function getAllActiveOperators($conn) {
  $allActiveOperatorsQuery = "SELECT 
                              id,
                              first_name, 
                              last_name
                              FROM user
                              WHERE status = 'active' AND role = 'operator'";

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

function combineInformation($allActiveData, $opsAvailabilityData) {
  for ($index = 0; $index < count($allActiveData); $index++) {
    $flag = 0;
    for ($avIndex = 0; $avIndex  < count($opsAvailabilityData); $avIndex++) {
      if ($allActiveData[$index]['id'] === $opsAvailabilityData[$avIndex]['id']){
        $flag = true;
        break;
      }
    }
    if ($flag) {
      $allActiveData[$index]['submitted'] = 1;
    }
  }
  print(json_encode($allActiveData));
}

$allActiveData = getAllActiveOperators($conn);
$opsAvailabilityData = getOperatorsWithSubmittedAvailability($conn, $session);
combineInformation($allActiveData, $opsAvailabilityData);

?>

