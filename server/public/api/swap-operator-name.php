<?php

require_once("functions.php");
set_exception_handler('error_handler');
require_once("db_connection.php");


$id = $_GET['id'];

$query = "SELECT `first_name`, `last_name` FROM `user` WHERE `id` = {$id}";

$result = mysqli_query($conn, $query);
if(!$result) {
  throw new Exception("Exception error " . mysqli_error($conn));
}

$output = [];

while($row = mysqli_fetch_assoc($result)){
  $output[] = $row;
}

print(json_encode($output));
