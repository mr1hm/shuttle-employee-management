<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();
if ($user === NULL){
    throw new ApiError(NULL, 401, 'Unauthorized');
}

$query = '
    SELECT
        rnd.id AS round_id,
        DAYOFWEEK(DATE(FROM_UNIXTIME(rnd.date))) AS day_of_week,
        DATE(FROM_UNIXTIME(rnd.date)) AS date,
        CAST(rnd.start_time AS CHAR) AS start_time,
        CAST(rnd.end_time AS CHAR) AS end_time,
        s.id AS session_id,
        s.name AS session_name,
        u.uci_net_id, u.last_name, u.first_name,
        rte.line_name,
        bi.bus_number
    FROM round AS rnd
    JOIN session AS s ON rnd.session_id = s.id
    LEFT JOIN (
        SELECT u.*
        FROM user AS u
        JOIN user_roles AS ur ON u.id = ur.user_id
        LEFT JOIN roles AS r ON ur.role_id = r.id AND r.`mid` != "operators"
        WHERE r.mid IS NULL
    ) AS u ON rnd.user_id = u.id
    JOIN bus_info AS bi ON rnd.bus_info_id = bi.id
    JOIN route AS rte ON bi.route_id = rte.id AND s.id = rte.session_id
    WHERE rnd.`status` = "posted"
    AND u.id != 1
    AND u.id != ?
    AND rnd.date > UNIX_TIMESTAMP()
';

$statement = $mysqli->prepare($query);
if ($statement == FALSE){
    throw new ApiError(null, 500, 'Error preparing query');
}

if (!$statement->bind_param('i', $user['userId'])){
    throw new ApiError(null, 500, 'Error binding query params');
}

if (!$statement->execute()){
    throw new ApiError(null, 500, 'Error executing query');
}

$result = $statement->get_result();
if ($result === FALSE) {
    throw new ApiError(null, 500, 'Error retrieving shift data');
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

send($data);
