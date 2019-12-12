<?php

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
