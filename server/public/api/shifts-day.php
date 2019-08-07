<?php
require_once 'db_connection.php';
$query = "SELECT * FROM `shift`";
$result = mysqli_query($conn, $query);
if(!$result) {
    print "ERROR: " . mysqli_connect_error();
    exit();
}
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}
$output = [
    'success'=>true,
    'data'=>$data
];
$json_output = json_encode($output);
print ($json_output);
?>
