<?php
require_once('db_connection.php');
require_once('functions.php');
set_exception_handler('error_handler');

$query = "SELECT user.first_name, user.last_name, transaction.user_id, transaction.round_id, transaction.round_id,transaction.date,transaction.type,transaction.comment
FROM `transaction`,`user`
WHERE transaction.type=". $_GET['type'] . "AND transaction . user_id=user.id";
$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}
print(json_encode($data));
