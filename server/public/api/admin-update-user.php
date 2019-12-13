<?php
require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
require_once(ADMIN);
define('ALLOWED_ROLES', ['super_admin', 'admin']);

$user = getRequestUser();

if(!$user || !userHasPermission($user, ALLOWED_ROLES)) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$errors = [];

if(!isset($_POST['cellProvider'])) {
  $errors[] = 'Missing cell phone provider';
}
if(!isset($_POST['email'])) {
  $errors[] = 'Missing email';
} else {
  $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL, [
    'flags' => [FILTER_FLAG_EMAIL_UNICODE],
  ]);
  if ($email == FALSE){
    $errors[] = 'Invalid email';
  }
}
if(!isset($_POST['firstName'])) {
  $errors[] = 'Missing first name';
}
if(!isset($_POST['lastName'])) {
  $errors[] = 'Missing last name';
}
if(!isset($_POST['originalUciNetId'])) {
  $errors[] = 'Missing original uci net id';
}
if(!isset($_POST['phone'])) {
  $errors[] = 'Missing phone number';
} else if (!preg_match('/[0-9]{10}/', $_POST['phone'])) {
  $errors[] = 'Invalid phone number';
}
if(!isset($_POST['shirtSize'])) {
  $errors[] = 'Missing shirt size';
}
if(!isset($_POST['uciNetId'])) {
  $errors[] = 'Missing UCI Net ID';
}

if(count($errors)) {
  throw new ApiError(['errors' => $errors], 422);
}

extract($_POST, EXTR_SKIP);

$stmt = $mysqli->prepare('UPDATE `user` SET
  cell_provider_id=?, email=?, first_name=?, last_name=?, phone=?, shirt_size_id=?, uci_net_id=?
  WHERE uci_net_id=?
');
$stmt->bind_param('isssiiss', $cellProvider, $email, $firstName, $lastName, $phone, $shirtSize, $uciNetId, $originalUciNetId);
$stmt->execute();

if(!$stmt->affected_rows) {
  throw new ApiError(null, 500, 'Error updating user');
}

$userData = adminGetUser($uciNetId);

send($userData);
