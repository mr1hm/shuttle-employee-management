<?php
require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
    throw new ApiError(null, 401, 'Not Authorized');
}

$result = $mysqli->query('SELECT id, size FROM shirt_sizes');

if(!$result) {
    throw new ApiError(null, 500, 'Error getting shirt sizes');
}

$data = [
    'sizes' => [],
    'map' => []
];

while($row = $result->fetch_assoc()) {
    $data['sizes'][] = $row;
    $data['map'][$row['id']] = $row['size'];
}

send($data);
