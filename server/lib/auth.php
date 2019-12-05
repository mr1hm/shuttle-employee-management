<?php
require_once(__DIR__.'/start_up.php');
require_once(__DIR__.'/../config/auth.php');
require_once(ENCRYPT);

function login($email, $password) {
  $loginError = 'Invalid email or password';
  $user = getUserByEmail($email, $loginError);

  $password_match = password_verify($password, $user['password']);

  if(!$password_match) {
    throw new ApiError(null, 401, $loginError);
  }

  return $user;
}

function getUserByEmail($email, $errorMsg) {
  return getUser('email=?', $email, $errorMsg);
}

function getUserByUciNetId($netId) {
  $user = getUser('uci_net_id=?', $netId);

  unset($user['password']);
  
  return $user;
}

function getUser($where, $value, $errorMsg = 'Not Authorized') {
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
  return "SELECT uci_net_id AS uciNetId, `password`, email, CONCAT(first_name, ' ', last_name) AS `name`, CONCAT('[', GROUP_CONCAT('\"', r.mid, '\"'), ']') AS roles
    FROM `user` AS u
    LEFT JOIN user_roles as ur
    ON u.id=ur.user_id
    LEFT JOIN roles AS r
    ON ur.role_id=r.id
    WHERE $where
    GROUP BY uciNetId, `password`, name, email";
}

function buildUserSessionData($user) {
  return [
    'uciNetId' => $user['uciNetId'],
    'ts' => time()
  ];
}
