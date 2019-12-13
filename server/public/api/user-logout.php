<?php
require_once('../../lib/startup.php');

session_destroy();

send(null, 204);
