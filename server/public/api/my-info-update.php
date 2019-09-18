<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$id = (isset($_POST['id']) ? $_POST['id'] : '');
$phone = $_POST['phone'];
$cellProvider = $_POST['cellProvider'];
$shirtSize = $_POST['shirtSize'];

if(empty($id)){
  throw new Exception('invaild id');
}

if(!empty($_POST['cellProvider'])){
  $cellProvider = $_POST['cellProvider'];
}else{
  throw new Exception('invaild cellProvider');
}

if (preg_match("/^[0-9]{10}$/", $phone)) {
  $phone = $_POST['phone'];
}else{
  throw new Exception('invaild phone number');
}

switch($shirtSize){
  case "S":
  case "M":
  case "L":
  case "XL":
  case "XXL":
  $shirtSize = $_POST['shirtSize'];
  break;
  default:
  throw new Exception('invaild shirt size');
}

$query = "UPDATE user SET user.phone='$phone',user.cell_provider='$cellProvider',user.shirt_size='$shirtSize'
WHERE id =" . $id;
$result = mysqli_query($conn,$query);

header("Location: http://localhost:3000/myinfo");

exit();
?>
