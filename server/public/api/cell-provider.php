<?php

require_once(__DIR__.'/../../lib/startup.php');

$query = "SELECT id, cell_provider AS `name` FROM cellProvider";

$result = $mysqli->query($query);
if (!$result) {
  throw new ApiError(null, 500, 'Error retrieving cell provider data');
}

$data = [
  'providers' => [],
  'map' => []
];
while ($row = $result->fetch_assoc()) {
  $data['providers'][] = $row;
  $data['map'][$row['id']] = $row['name'];
}

send($data);
?>
