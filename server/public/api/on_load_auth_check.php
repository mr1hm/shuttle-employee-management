<?php
require('../../lib/start_up.php');
require(AUTH);

$user = getRequestUser();

if(!$user) {
    send(null, 204);
    exit;
}

$_SESSION['user'] = buildUserSessionData($user);

cleanUser($user);

send($user);
