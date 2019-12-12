<?php

function addRoleToUser($roleId, $uciId, $grantedById) {
  global $mysqli;

  $stmt = $mysqli->prepare('INSERT INTO user_roles 
    (role_id, user_id, granted_by) 
    VALUES (?, (SELECT id FROM `user` WHERE uci_net_id=?), ?)'
  );
  $stmt->bind_param('isi', $roleId, $uciId, $grantedById);
  $stmt->execute();

  if(!$stmt->affected_rows) {
    throw new ApiError(null, 500, 'Error adding role to user');
  }
}

function removeRoleFromUser($roleId, $uciId) {
  global $mysqli;

  $stmt = $mysqli->prepare('DELETE FROM user_roles
    WHERE role_id=? AND user_id=(SELECT id FROM `user` WHERE uci_net_id=?)'
  );
  $stmt->bind_param('is', $roleId, $uciId);
  $stmt->execute();

  if(!$stmt->affected_rows) {
    throw new ApiError(null, 500, 'Error removing user role');
  }
}

function adminGetUser($uciId) {
  global $mysqli;

  $stmt = $mysqli->prepare("SELECT 
    uci_net_id AS uciNetId, last_name AS lastName, first_name AS firstName, nickname, status, special_route_ok AS specialRouteOk, phone, email, cell_provider AS cellProvider, shirt_size AS shirtSize, CONCAT('[', GROUP_CONCAT('\"', r.mid, '\"'), ']') AS roles
    FROM user AS u
    LEFT JOIN user_roles as ur
    ON u.id=ur.user_id
    LEFT JOIN roles AS r
    ON ur.role_id=r.id
    WHERE uci_net_id=?
    GROUP BY uciNetId, lastName, firstName, nickname, status, specialRouteOk, phone, email, cellProvider, shirtSize
  ");

  $stmt->bind_param('s', $uciId);
  $stmt->execute();

  $result = $stmt->get_result();

  if (!$result) {
    throw new ApiError(null, 500, 'Error retrieving user\'s data');
  }

  $user = $result->fetch_assoc();

  if(!$user) return null;

  $user['specialRouteOk'] = (bool) $user['specialRouteOk'];
  $user['roles'] = json_decode($user['roles']);

  return $user;
}

function getRolesMap() {
  global $mysqli;

  $result = $mysqli->query('SELECT mid, id FROM roles');

  $rolesMap = [];

  while($row = $result->fetch_assoc()) {
    $rolesMap[$row['mid']] = $row['id'];
  }

  return $rolesMap;
}

function userHasRole($roleMid, $uciId) {
  global $mysqli;

  $stmt = $mysqli->prepare('SELECT r.id FROM `user` AS u
    JOIN user_roles AS ur ON u.id=ur.user_id
    JOIN roles AS r ON r.id=ur.role_id
    WHERE r.mid=? AND u.uci_net_id=?'
  );

  $stmt->bind_param('ss', $roleMid, $uciId);
  $stmt->execute();

  $result = $stmt->get_result();

  if(!$result) {
    throw new ApiError(null, 500, 'Error checking user roles');
  }

  if($result->num_rows) {
    return true;
  }

  return false;
}