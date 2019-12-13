<?php
require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);
define('ALLOWED_ROLES', ['super_admin', 'admin']);

$user = getRequestUser();

if(!$user || !userHasPermission($user, ALLOWED_ROLES)) {
  throw new ApiError(null, 401, 'Not Authorized');
}

$removeAdminRoles = ' WHERE mid != "super_admin" AND mid != "admin"';

if(userHasPermission($user, ['super_admin'])) {
  $removeAdminRoles = '';
}

$result = $mysqli->query('SELECT id, display_name AS displayName FROM roles'.$removeAdminRoles);

if(!$result) {
  throw new ApiError(null, 500, 'Error getting available roles');
}

$data = [
  'roles' => [],
  'map' => []
];

while($row = $result->fetch_assoc()) {
  $data['roles'][] = $row;
  $data['map'][$row['id']] = $row['displayName'];
}

send($data);
