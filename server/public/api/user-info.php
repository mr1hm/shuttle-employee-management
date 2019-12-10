<?php

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$query = "SELECT
  uci_net_id AS uciNetId, last_name AS lastName, first_name AS firstName, email,
  cell_provider AS cellProvider, phone, url, shirt_size AS shirtSize
  FROM user
  WHERE id = ?";

$statement = $mysqli->prepare($query);
if ($statement == FALSE){
  throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('i', $user['userId'])){
  throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
  throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result == FALSE){
  throw new ApiError(null, 500, 'Error getting user data');
}

if (empty($user = $result->fetch_assoc())){
  throw new ApiError(null, 500, 'Error getting user data');
}

send($user);
