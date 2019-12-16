<?php
require_once('../../lib/startup.php');
require_once(ADMIN);
require_once(AUTH);

define('ALLOWED_ROLES', ['admin', 'super_admin']);
$uciId = null;

$user = getRequestUser();

if (!$user || !userHasPermission($user, ALLOWED_ROLES)) {
  throw new ApiError(null, 401, 'Not Authorized');
}

if (!isset($_GET['uciId'])) {
  throw new ApiError(null, 422, 'Missing User UCI Net ID');
}

$uciId = $_GET['uciId'];

$userData = adminGetUser($uciId);

if (!$userData) {
  throw new ApiError(null, 422, "'$uciId' Is not a valid user UCI Net ID");
}

send($userData);
