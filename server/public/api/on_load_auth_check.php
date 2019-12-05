<?php
require('../../lib/start_up.php');
require(AUTH);
$user_data = null;

if(isset($_SESSION['user'])) {
    $user_data = $_SESSION['user'];
} else if(isset($_SERVER[AUTH_HEADER])) {
    $token = $_SERVER[AUTH_HEADER];

    $user_data = decrypt($token);
}

if(!$user_data) {
    send(null, 204);
    exit;
}

$user = getUserByUciNetId($user_data['uciNetId']);

$_SESSION['user'] = buildUserSessionData($user);

send($user);
