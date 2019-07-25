<?php
if (empty(INTERNAL)) {
  exit('direct access not allowed');
} 
$id = getBodyData();
$id = intval($id);
if ($id<=0) {
  throw new Exception('valid id needed');
}
if (empty($_SESSION['cartId'])) {
  $cartID = $_SESSION['cartId'];
} else {
  $cartID = false;
}
$price = "SELECT price from products WHERE id= " . $id;
echo($price);
?>