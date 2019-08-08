<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

// $lowerDateRange = intval($_GET['unixstart']);
// $upperDateRange = intval($_GET['unixend']);

if (!empty($_GET['id'])) {
    $ownerID = intval($_GET['id']);
} else throw new Exception('need id for query');

if (!empty($_GET['unixstart'])) {
    $lowerDateRange = intval($_GET['unixstart']);
} else throw new Exception('need lower limit date range for query');

if (!empty($_GET['unixend'])) {
    $upperDateRange = intval($_GET['unixend']);
} else throw new Exception('need upper limit date range for query');

$query = "SELECT * FROM `shift` WHERE `ownerID`= {$ownerID} AND (`shiftDate` >= {$lowerDateRange} AND `shiftDate` <={$upperDateRange})
            ORDER BY `shiftDate` ASC";

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