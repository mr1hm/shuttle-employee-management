<?php
require_once('../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$userQuery = "SELECT uci_net_id AS uciNetId, last_name AS lastName, first_name AS firstName, email, cell_provider AS cellProvider, phone, url, shirt_size AS shirtSize
              FROM user
              WHERE id=$user[userId]";


if($result = $mysqli->query($userQuery)){
  $user = $result->fetch_assoc();

  send($user);
  exit;
}

throw new ApiError(null, 500, 'Error getting user data');
