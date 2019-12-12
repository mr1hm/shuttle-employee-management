<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$startDate = $data['avail_start_date'];
$endDate = $data['avail_end_date'];
$sessionId = intval($data['session_id']);

$editAvailabilityDatesQuery = "UPDATE session 
                               SET 
                               availStartDateString = '$startDate',
                               availEndDateString = '$endDate'
                               WHERE id = $sessionId";

$result = mysqli_query($conn, $editAvailabilityDatesQuery);

if(!$result) {
  throw new Exception('MySQL update error: '.mysqli_error($conn));
}

?>