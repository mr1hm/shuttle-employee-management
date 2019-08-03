<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$query = "SELECT startTime,endTime,shiftDate FROM `shift` WHERE `ownerID` = 1";
$result = mysqli_query($conn, $query);

if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

print(json_encode($data));

?>
