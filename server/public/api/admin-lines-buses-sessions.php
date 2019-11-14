<?php

require_once 'functions.php';
set_exception_handler('error_handler');
require_once 'db_connection.php';
$method = $_SERVER['REQUEST_METHOD'];

$bodyData = getBodyData();

if ($method === 'GET') {

  $query = "SELECT * FROM `session`";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }

  print(json_encode($data));

}

if ($method === 'POST' && (isset($bodyData['name']))) {

  $name = $bodyData['name'];
  $startDate = $bodyData['startDate'];
  $endDate = $bodyData['endDate'];
  $notes = $bodyData['notes'];

  $query = "INSERT INTO `session` (`name`, `startDate`, `endDate`, `notes`)
          VALUES ('$name', '$startDate', '$endDate', '$notes')";
  $result = mysqli_query($conn, $query);

  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $query = "SELECT * FROM `session`";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }

  print(json_encode($data));

}

?>
