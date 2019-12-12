<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();

if(!$user) {
    send(null, 204);
    exit;
}

$_SESSION['user'] = buildUserSessionData($user);

cleanUser($user);

send($user);
