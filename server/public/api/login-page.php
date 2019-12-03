<?php
  require_once('start_up.php');

  $error_msg = 'Email password combination do not match';
  $errors = [];

  if(isset($_POST['email'])) {
    $email = $_POST['email'];
  } else {
    $errors[] = 'Missing email';
  }

  if(isset($_POST['password'])) {
    $password = $_POST['password'];
  } else {
    $errors[] = 'Missing password';
  }

  if(count($errors)) {
    throw new ApiError(['errors' => $errors], 422);
  }

  $stmt = $mysqli->prepare('
    SELECT uci_net_id AS uciNetId, `password`, email, CONCAT(first_name, " ", last_name) AS `name`, CONCAT("[", GROUP_CONCAT(JSON_OBJECT("mid", r.mid, "name", r.display_name)), "]") AS roles
    FROM `user` AS u
    LEFT JOIN user_roles as ur
    ON u.id=ur.user_id
    LEFT JOIN roles AS r
    ON ur.role_id=r.id
    WHERE email=?
    GROUP BY uciNetId, `password`, name, email
  ');

  if(!$stmt) {
    throw new ApiError(null, 500, $mysqli->error);
  }

  $stmt->bind_param('s', $email);
  $stmt->execute();

  $result = $stmt->get_result();

  if(!$result->num_rows) {
    throw new ApiError(null, 401, $error_msg);
  }

  $user = $result->fetch_assoc();

  $password_match = password_verify($password, $user['password']);

  if(!$password_match) {
    throw new ApiError(null, 401, $error_msg);
  }

  $user['roles'] = $roles = json_decode($user['roles'], 1);

  if(count($roles) === 1 && $roles[0]['mid'] === null) {
    $user['roles'] = [];
  }

  unset($user['password']);

  $SESSION['user'] = $user;

  send($user, 201);
?>
