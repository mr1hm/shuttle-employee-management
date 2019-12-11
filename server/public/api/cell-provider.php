<?php

require(__DIR__.'/../../lib/startup.php');

$query = "SELECT cell_provider FROM cellProvider";

$result = $mysqli->query($query);
if (!$result) {
  throw new ApiError(null, 500, 'Error retrieving cell provider data');
}

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

send($data);
?>
