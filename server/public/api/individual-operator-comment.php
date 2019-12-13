<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$sessionId = intval($data['session_id']);
$userId = intval($data['user_id']);

$individualOperCommentQuery = "SELECT
                        comment
                        FROM operator_week_detail
                        WHERE 
                        session_id = $sessionId and user_id = $userId";

$result = mysqli_query($conn, $individualOperCommentQuery);

if (!$result) {
throw new Exception('MySQL update error: '.mysqli_error($conn));
}

$individualOperComment = [];

while ($row = mysqli_fetch_assoc($result)) {
  $individualOperComment[] = $row;
}

print(json_encode($individualOperComment[0]));

?>