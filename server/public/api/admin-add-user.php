<?php
require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
define('ALLOWED_ROLES', ['super_admin', 'admin']);

$user = getRequestUser();

if(!$user || !userHasPermission($user, ALLOWED_ROLES)) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$errors = [];

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
if(!isset($_POST['password'])) {
  $errors[] = 'Missing password';
}
if(!isset($_POST['role'])) {
  $errors[] = 'Missing role';
}
if(!isset($_POST['special'])) {
  $errors[] = 'Missing special route info';
}
if(!isset($_POST['status'])) {
  $errors[] = 'Missing user status';
}
if(!isset($_POST['uciNetId'])) {
  $errors[] = 'Missing UCI Net ID';
}

if(count($errors)) {
  throw new ApiError(['errors' => $errors], 422);
}

extract($_POST, EXTR_SKIP);

$password = password_hash($password, PASSWORD_BCRYPT);

$roleStmt = $mysqli->prepare('SELECT mid FROM roles WHERE id=?');
$roleStmt->bind_param('i', $role);
$roleStmt->execute();

$roleResult = $roleStmt->get_result();

if(!$roleResult || !$roleResult->num_rows) {
  throw new ApiError(null, 422, 'Error checking role');
}

$userRole = $roleResult->fetch_assoc();

if($userRole['mid'] === 'super_admin' || $userRole['mid'] === 'admin') {
  if(!userHasPermission($user, ['super_admin'])) {
    throw new ApiError(null, 401, 'Insufficient permissions');
  }
}

$stmt = $mysqli->prepare('INSERT INTO `user`
  (email, first_name, last_name, `password`, special_route_ok, `status`, uci_net_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
');

$stmt->bind_param('ssssiss', $email, $firstName, $lastName, $password, $special, $status, $uciNetId);
$stmt->execute();

if(!$stmt->affected_rows) {
  throw new ApiError(null, 500, $stmt->error);
}

$newUserId = $stmt->insert_id;

$newUserRoleStmt = $mysqli->prepare('INSERT INTO user_roles
  (role_id, user_id, granted_by)
  VALUES (?, ?, ?)
');
$newUserRoleStmt->bind_param('iii', $role, $newUserId, $user['userId']);
$newUserRoleStmt->execute();

send(['userUciNetId' => $uciNetId], 201);
