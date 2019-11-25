<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();

$sessionQuery = "SELECT 
              id,
              name
              FROM session";

$result = mysqli_query($conn, $sessionQuery);
if(!$result){
throw new Exception('MySQL update error: '.mysqli_error($conn));
}

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}

print(json_encode($data));
?>