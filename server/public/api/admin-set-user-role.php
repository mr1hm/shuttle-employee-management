<?php
require_once('../../lib/startup.php');
require_once(AUTH);
require_once(ADMIN);
define('ALLOWED_ROLES', ['super_admin', 'admin']);

$user = getRequestUser();
$userIsSuperAdmin = false;

if(!$user || !userHasPermission($user, ALLOWED_ROLES)) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$errors = [];

if(!isset($_POST['role'])) {
  $errors[] = 'No role sent';
}

if(!isset($_POST['uciId'])) {
  $errors[] = 'No UCI Net ID sent';
}

if(count($errors)) {
  throw new ApiError(['errors' => $errors], 422);
}

$role = $_POST['role'];
$uciId = $_POST['uciId'];
$rolesMap = getRolesMap();
$roleId = $rolesMap[$role];

if(userHasPermission($user, ['super_admin'])) {
  $userIsSuperAdmin = true;
}

if(($role === 'super_admin' || $role === 'admin') && !$userIsSuperAdmin) {
  throw new ApiError(null, 401, 'Insufficient Permissions');
}

$userHasRole = userHasRole($role, $uciId);
$action = null;

if($userHasRole) {
  removeRoleFromUser($roleId, $uciId);
  $action = 'removed';
} else {
  addRoleToUser($roleId, $uciId ,$user['userId']);
  $action = 'added';
}

$usersRoles = getUsersRoles($uciId);

send($usersRoles);
