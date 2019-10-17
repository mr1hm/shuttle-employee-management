<?php

require_once("functions.php");
set_exception_handler('error_handler');
require_once("db_connection.php");


$round_id = $_GET['round_id'];
$date = $_GET['date'];
$start_time = $_GET['start_time'];
$end_time = $_GET['end_time'];


$query = "SELECT `id` FROM `user`
          WHERE `id` NOT IN
          (
              SELECT `user_id` FROM `round`
              WHERE `date`={$date}
              AND `start_time` BETWEEN {$start_time} AND {$end_time}
              AND `end_time` BETWEEN {$start_time} AND {$end_time}
           )";

$result = mysqli_query($conn, $query);


?>
