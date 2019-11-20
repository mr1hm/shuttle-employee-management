<?php
require_once('db_connection.php');
$query = "SELECT cell_provider FROM cellProvider";
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
