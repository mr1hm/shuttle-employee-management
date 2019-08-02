<?php
 require_once('functions.php');

 $conn = mysqli_connect('localhost', 'root', 'root', 'anteaterExpress', 3306)
 if (!$conn) {
     throw new Exception("Error Message: ", mysqli_connect_error('error_handler'));
 }

 $output = file_get_contents('dummy-data/dummy-data-shifts-day.json');
  print($output);

?>