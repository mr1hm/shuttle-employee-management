<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
if (!empty($_GET['id'])) {
  $id = $_GET['id'];
  if (!is_numeric($id)) {
    throw new Exception('id needs to be a number');
  }
  $id = intval($id);
}
$startDate = $_GET['startDate'];
$endDate = $_GET['endDate'];

$query = "SELECT * FROM `round` WHERE `user_id`= {$id} AND (`date` >= '$startDate' AND `date` <= '$endDate')
ORDER BY `date`, `start_time` ASC";

$result = mysqli_query($conn, $query);

  if(!$result){
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

  $data = [];
  while($row = mysqli_fetch_assoc($result)){

    $row['posted'] = $row['status'] === 'posted' ? true: false;
    unset($row['status']);
    $data[] = $row;
  }

print(json_encode($data));
