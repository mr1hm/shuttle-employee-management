<?php
require_once('db_connection.php');
$id = (isset($_POST['id']) ? $_POST['id'] : '');
$email = $_POST['email'];
$phone = $_POST['phone'];
$cellProvider = $_POST['cellProvider'];
$shirtSize = $_POST['shirtSize'];
$query = "UPDATE user SET user.email='$email',user.phone='$phone',user.cell_provider='$cellProvider',user.shirt_size='$shirtSize'
WHERE id =" . $id;
$result = mysqli_query($conn,$query);
header("Location: http://localhost:3000/myinfo");
exit();
?>
