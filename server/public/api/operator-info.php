<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$userId = intval($data['id']);

$userQuery = "SELECT 
              uci_net_id,
              last_name,
              first_name,
              email,
              cell_provider,
              phone,
              url,
              shirt_size
              FROM user
              WHERE id='$userId'";

$result = mysqli_query($conn, $userQuery);
if(!$result){
throw new Exception('MySQL update error: '.mysqli_error($conn));
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode($data));
?>
