<?php
require_once(__DIR__.'/startup.php');
require_once(__DIR__.'/../config/auth.php');
require_once(ENCRYPT);

// Remove sensitive data from user before sending to client
function cleanUser(&$user) {
  unset($user['password']);
  unset($user['userId']);
}

function getRequestUser() {
  $user = null;

  if(isset($_SESSION['user'])) {
      $user = getUserFromSession();
  } else if(isset($_SERVER[AUTH_HEADER])) {
      $user = getUserFromToken($_SERVER[AUTH_HEADER]);
  }

  return $user;
}

// If permitted roles is left empty a user with any role may access
// Otherwise user role must exist in permitted roles to access
function userHasPermission($user = null, $permittedRoles = []) {
  if(!$user || !isset($user['roles']) || !is_array($user['roles'])){
    return false;
  }

  if((!count($permittedRoles) && count($user['roles'])) || !empty(array_intersect($permittedRoles, $user['roles']))) {
    return true;
  }

  return false;
}

function login($email, $password) {
  $loginError = 'Invalid email or password';
  $user = getUserByEmail($email, $loginError);

  $password_match = password_verify($password, $user['password']);

  if(!$password_match) {
    throw new ApiError(null, 401, $loginError);
  }

  return $user;
}

function getUserFromToken($token = null) {
  if(!$token) return null;

  $userData = decrypt($token);

  return getUserById($userData['userId']);
}

function getUserFromSession() {
  if(!isset($_SESSION['user'])) {
    return null;
  }

  return getUserById($_SESSION['user']['userId']);
}

function getUserByEmail($email, $errorMsg) {
  return getUserFromDb('email=?', $email, $errorMsg);
}

function getUserById($id) {
  return getUserFromDb('u.id=?', $id);
}

function getUserByUciNetId($netId) {
  $user = getUserFromDb('uci_net_id=?', $netId);

  unset($user['password']);
  
  return $user;
}

function getUserFromDb($where, $value, $errorMsg = 'Not Authorized') {
  global $mysqli;

  $stmt = $mysqli->prepare(buildQuery($where));

  if(!$stmt) {
    throw new ApiError(null, 500, $mysqli->error);
  }

  $stmt->bind_param('s', $value);
  $stmt->execute();

  $result = $stmt->get_result();

  if(!$result->num_rows) {
    throw new ApiError(null, 401, $errorMsg);
  }

  $user = $result->fetch_assoc();

  $user['roles'] = $roles = json_decode($user['roles'], 1);

  return $user;
}

function buildQuery($where) {
  return "SELECT u.id AS userId, uci_net_id AS uciNetId, `password`, email, CONCAT(first_name, ' ', last_name) AS `name`, CONCAT('[', GROUP_CONCAT('\"', r.mid, '\"'), ']') AS roles
    FROM `user` AS u
    LEFT JOIN user_roles as ur
    ON u.id=ur.user_id
    LEFT JOIN roles AS r
    ON ur.role_id=r.id
    WHERE $where
    GROUP BY userId, uciNetId, `password`, name, email";
}

function buildUserSessionData($user) {
  return [
    'userId' => $user['userId'],
    'ts' => time()
  ];
}
