<?php

require_once(__DIR__.'/../../lib/startup.php');

switch($_SERVER['REQUEST_METHOD']){
    default:
        throw new ApiError(NULL, 405, 'Method Not Allowed');
    case 'GET':
        require_once('get.php');
        break;
}
