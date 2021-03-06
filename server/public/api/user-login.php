<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$rememberMe = false;

$errors = [];

if(!array_key_exists('email', $_POST)) {
  $errors[] = 'Missing email';
} else {
  $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL, [
    'flags' => [FILTER_FLAG_EMAIL_UNICODE],
  ]);
  if ($email == FALSE){
    $errors[] = 'Invalid email';
  }
}

if (!array_key_exists('password', $_POST)){
  $errors[] = 'Missing password';
} else {
  $password = filter_var($_POST['password'], FILTER_UNSAFE_RAW, [
    'flags' => FILTER_FLAG_STRIP_LOW,
  ]);
  if ($password == FALSE || strlen($password) != strlen($_POST['password'])){
    $errors[] = 'Invalid characters in password';
  }
}

if(count($errors)) {
  throw new ApiError(['errors' => $errors], 422);
}

if(array_key_exists('rememberMe', $_POST)) {
  $rememberMe = filter_var($_POST['rememberMe'], FILTER_VALIDATE_BOOLEAN);
}

$user = login($email, $password);

$_SESSION['user'] = buildUserSessionData($user);

if($rememberMe) {
  $user['token'] = encrypt($_SESSION['user']);
}

cleanUser($user);

send($user);
?>
