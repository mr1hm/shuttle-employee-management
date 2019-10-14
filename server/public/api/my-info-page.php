<?php
require_once('db_connection.php');
$query = "SELECT user.url,user.cell_provider,user.first_name,user.last_name,user.uci_net_id,user.email,user.phone,user.shirt_size
FROM `user`
WHERE `user`.id=" . $_GET['id'];
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
