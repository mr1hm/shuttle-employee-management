<?php

require(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

  $rememberMe = false;

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

  if(isset($_POST['rememberMe'])) {
    $rememberMe = $_POST['rememberMe'] === 'true';
  }

  $user = login($email, $password);

  $_SESSION['user'] = buildUserSessionData($user);

  if($rememberMe) {
    $user['token'] = encrypt($_SESSION['user']);
  }

  cleanUser($user);

  send($user);
?>
