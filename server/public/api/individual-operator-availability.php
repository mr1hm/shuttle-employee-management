<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$sessionId = intval($data['session_id']);
$userId = intval($data['user_id']);

$individualOperAvailQuery = "SELECT
                        day_of_week,
                        start_time,
                        end_time
                        FROM operator_availability 
                        WHERE 
                        session_id = $sessionId and user_id = $userId
                        ORDER BY
                        day_of_week ASC";

$result = mysqli_query($conn, $individualOperAvailQuery);

if (!$result) {
throw new Exception('MySQL update error: '.mysqli_error($conn));
}

$individualOperAvail = [];

while ($row = mysqli_fetch_assoc($result)) {
  $individualOperAvail[] = $row;
}

print(json_encode($individualOperAvail));

?>