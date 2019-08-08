<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

if (!empty($_GET['startTime'])) {
  $startTime = $_GET['startTime'];
  if ($startTime < 600) {
    throw new Exception('start time is too early');
  }
  $startTime = intval($startTime);
}

// if (!empty($_GET['shiftDate'])) {
//   $shiftDate = $_GET['shiftDate'];
//   if ($shiftDate < 600) { ????? fix 
//     throw new Exception('start time is too early');
//   }
//   $shiftDate = intval($shiftDate);
// }

// if (!empty($_GET['shiftDate'])) {
//     $shiftDate= $_GET['shiftDate'];
// } else throw new Exception('needs a date');

$shiftDate= $_GET['shiftDate'];

$query = "SELECT s.`id`, s.`ownerID`, s.`shiftDate`, s.`startTime`, s.`endTime`, s.`status`, s.`routeInfoID`,
        rbd.`busID`,
        rmd.`lineName`,
        rmd.`legDuration`
        FROM `shift`
        AS s INNER JOIN `routeBusDayInfo` AS rbd ON s.routeInfoID = rbd.id
        INNER JOIN routeMetaData rmd
        ON rbd.routeID = rmd.id
        WHERE `shiftDate` = {$shiftDate}";

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
