<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$userId = intval($data['id']);
$phone = $data['phone'];
$cellProvider = $data['cell_provider'];
$shirt = $data['shirt'];
$image = $data['image'];

$editUserQuery = "UPDATE user 
                  SET phone = '$phone',
                  cell_provider = '$cellProvider',
                  shirt_size = '$shirt',
                  url = '$image'
                  WHERE id = '$userId'";

$result = mysqli_query($conn, $editUserQuery);
if(!$result){
throw new Exception('MySQL update error: '.mysqli_error($conn));
}
?>