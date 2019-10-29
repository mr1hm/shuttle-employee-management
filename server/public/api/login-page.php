<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$email = $_POST['email'];
$password = $_POST['password'];
$query = "SELECT user.id FROM `user` WHERE user.email='$email'AND user.uci_net_id='$password'";
$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode(array_values($data[0])));

?>
