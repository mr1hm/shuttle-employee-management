<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$sessionId = intval($data['session_id']);

$availabilityParametersQuery = "SELECT
                                avail_start_date,
                                avail_end_date,
                                min_operator_hours,
                                min_operations_hours,
                                min_trainer_hours,
                                min_trainee_hours
                                FROM session
                                WHERE id = $sessionId";
  
$result = mysqli_query($conn, $availabilityParametersQuery);

if (!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode($data));
?>