<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

$ownerID = 1;
$ownerID = intval($ownerID);

$query = "SELECT `startTime`, `endTime`, `shiftDate` FROM `shift` WHERE `ownerID` = $ownerID";

if (!$ownerID) {
    throw new Exception('need id for query');
}

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
