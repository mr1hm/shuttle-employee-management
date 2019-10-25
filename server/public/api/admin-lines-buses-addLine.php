<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$bodyData = getBodyData();

if ($method === 'POST' && (isset($_POST['line_name']))) {
  $line_name = $_POST['line_name'];
  $status = $_POST['status'];
  $rounds = $_POST['rounds'];
  $roundDuration = $_POST['roundDuration'];
  $public = $_POST['public'];
  $regularService = $_POST['regularService'];
  $query = "INSERT INTO `route` (`line_name`, `status`, `rounds`, `roundDuration`, `public`, `regularService`)
            VALUES ('$line_name', '$status', '$rounds', '$roundDuration', '$public', '$regularService')";
}

$lineName = $_POST['line_name'];
$query = "SELECT * FROM `route`";
$result = mysqli_query($conn, $query);

if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data = $row;
}

print(json_encode($data));

header("Location: http://localhost:3000/admin-routes");

?>
