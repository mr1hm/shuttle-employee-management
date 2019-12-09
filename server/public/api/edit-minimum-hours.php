<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$minOperatorHours = intval($data['min_operator_hours']);
$minOperationsHours = intval($data['min_operations_hours']);
$minTrainerHours = intval($data['min_trainer_hours']);
$minTraineeHours = intval($data['min_trainee_hours']);
$sessionId = intval($data['session_id']);

$editAvailabilityDatesQuery = "UPDATE session 
                               SET 
                               min_operator_hours = $minOperatorHours,
                               min_operations_hours = $minOperationsHours,
                               min_trainer_hours = $minTrainerHours,
                               min_trainee_hours = $minTraineeHours
                               WHERE id = $sessionId";

$result = mysqli_query($conn, $editAvailabilityDatesQuery);

if(!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
}

?>