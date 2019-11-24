<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');

if (!empty($_GET['unixstart'])) {
    $lowerDateRange = $_GET['unixstart'];
} else throw new Exception('need lower limit date range for query');

if (!empty($_GET['unixend'])) {
    $upperDateRange = $_GET['unixend'];
} else throw new Exception('need upper limit date range for query');

if (!empty($_GET['id'])) {
    $ownerID = intval($_GET['id']);
} else throw new Exception('need id for query');

$query = "SELECT *
  FROM `round`
  WHERE `user_id`= {$ownerID}
  AND (`date` >= '$lowerDateRange' AND `date` <= '$upperDateRange')
  AND (`status` = 'scheduled' OR `status` = 'posted')
  ORDER BY `date` ASC";

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
