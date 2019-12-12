<?php

require_once(__DIR__.'/../../lib/startup.php');
require_once(AUTH);

$user = getRequestUser();
if ($user === NULL){
    throw new ApiError(NULL, 401, 'Unauthorized');
}

/**
 * Get Future Rounds Posted by other users
 */
$query = '
    SELECT
        rnd.id AS round_id, rnd.bus_info_id,
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

/**
 * Combine consecutive rounds into shifts, provided they:
 * - Are on the same date
 * - Are for the same bus (session, line, and bus number)
 * - Are posted by the same user (non-Operators are grouped into "Operations")
 * - Do not go over the maximum shift duration (3 hours)
 */
$shiftGroupingCache = [];
while ($row = mysqli_fetch_assoc($result)) {
    $base = &$shiftGroupingCache;
    if (!array_key_exists($row['date'], $base)){
        $base[$row['date']] = [
            'day_of_week' => $row['day_of_week'],
            'buses' => []
        ];
    }

    $base = &$base[$row['date']]['buses'];
    if (!array_key_exists($row['bus_info_id'], $base)){
        $base[$row['bus_info_id']] = [
            'session' => [
                'id' => $row['session_id'],
                'name' => $row['session_name']
            ],
            'bus_info' => [
                'line_name' => $row['line_name'],
                'bus_number' => $row['bus_number']
            ],
            'posted_by' => [
                'Operations' => [
                    'shifts' => []
                ]
            ]
        ];
    }

    $base = &$base[$row['bus_info_id']]['posted_by'];
    if ($row['uci_net_id'] === NULL){
        $base = &$base['Operations']['shifts'];
    } else {
        if (!array_key_exists($row['uci_net_id'], $base)){
            $base[$row['uci_net_id']] = [
                'last_name' => $row['last_name'],
                'first_name' => $row['first_name'],
                'shifts' => []
            ];
        }
        $base = &$base[$row['uci_net_id']]['shifts'];
    }

    $concurrentShifts = [
        'before' => NULL,
        'after' => NULL
    ];
    foreach ($base as $shiftIndex => $shift){
        if ($shift['end_time'] === $row['start_time']){
            if ($concurrentShifts['before'] !== NULL){
                $oldTime = intval($concurrentShifts['before'][1]['end_time']) - intval($concurrentShifts['before'][1]['end_time']);
                $newTime = intval($shift['end_time']) - intval($shift['start_time']);
                if ($oldTime <= $newTime){ continue; }
            }
            $concurrentShifts['before'] = [$shiftIndex, &$shift];
        } else if ($shift['start_time'] === $row['end_time']){
            if ($concurrentShifts['after'] !== NULL){
                $oldTime = intval($concurrentShifts['after'][1]['end_time']) - intval($concurrentShifts['after'][1]['end_time']);
                $newTime = intval($shift['end_time']) - intval($shift['start_time']);
                if ($oldTime <= $newTime){ continue; }
            }
            $concurrentShifts['after'] = [$shiftIndex, &$shift];
        }
    }

    define('MAX_SHIFT_TIME', 300);
    if (
        $concurrentShifts['before'] !== NULL
        && intval($row['end_time']) - intval($concurrentShifts['before'][1]['start_time']) > MAX_SHIFT_TIME
    ){ $concurrentShifts['before'] = NULL; }

    if (
        $concurrentShifts['after'] !== NULL
        && intval($concurrentShifts['after'][1]['end_time']) - intval($row['start_time']) > MAX_SHIFT_TIME
    ){ $concurrentShifts['after'] = NULL; }

    if (
        $concurrentShifts['before'] !== NULL
        && $concurrentShifts['after'] !== NULL
        && intval($concurrentShifts['after'][1]['end_time']) - intval($concurrentShifts['before'][1]['start_time']) > MAX_SHIFT_TIME
    ){
        $beforeShiftDuration = intval($concurrentShifts['before'][1]['end_time']) - intval($concurrentShifts['before'][1]['start_time']);
        $afterShiftDuration = intval($concurrentShifts['after'][1]['end_time']) - intval($concurrentShifts['after'][1]['start_time']);
        if ($beforeShiftDuration <= $afterShiftDuration){
            $concurrentShifts['after'] = NULL;
        } else {
            $concurrentShifts['before'] = NULL;
        }
    }

    $currentRound = [
        'id' => $row['round_id'],
        'start_time' => $row['start_time'],
        'end_time' => $row['end_time']
    ];

    if ($concurrentShifts['before'] !== NULL){
        $shift = &$base[$concurrentShifts['before'][0]];

        if ($concurrentShifts['after'] !== NULL){
            $shift['end_time'] = $concurrentShifts['after'][1]['end_time'];
            $shift['rounds'] = array_merge(
                $concurrentShifts['before'][1]['rounds'],
                $currentRound,
                $concurrentShifts['after'][1]['rounds']
            );
            array_splice($base, $concurrentShifts['after'][0], 1);
        } else {
            $shift['end_time'] = $row['end_time'];
            $shift['rounds'][] = $currentRound;
        }
    } else {
        if ($concurrentShifts['after'] !== NULL){
            $shift = &$base[$concurrentShifts['after'][0]];
            $shift['start_time'] = $row['start_time'];
            array_unshift($shift['rounds'], $currentRound);
        } else {
            $base[] = [
                'start_time' => $row['start_time'],
                'end_time' => $row['end_time'],
                'rounds' => [$currentRound]
            ];
        }
    }
    unset($base, $shift);
}

/**
 * Flatten shifts to rows for response body
 */
$responseBody = [];
foreach($shiftGroupingCache as $date => $dateShifts){
    foreach($dateShifts['buses'] as $busShifts){
        foreach($busShifts['posted_by'] as $posterUciNetId => $posterShifts){
            foreach($posterShifts['shifts'] as $shift){
                $shiftRow = [
                    'recurring' => FALSE,
                    'day_of_week' => $dateShifts['day_of_week'],
                    'start_date' => $date,
                    'end_date' => $date,
                    'start_time' => $shift['start_time'],
                    'end_time' => $shift['end_time'],
                    'session' => $busShifts['session'],
                    'bus_info' => $busShifts['bus_info'],
                    'rounds' => $shift['rounds'],
                    'conflicts' => [],
                ];

                if ($posterUciNetId === 'Operations'){
                    $shiftRow['posted_by'] = $posterUciNetId;
                } else {
                    $shiftRow['posted_by'] = [
                        'uci_net_id' => $posterUciNetId,
                        'last_name' => $posterShifts['last_name'],
                        'first_name' => $posterShifts['first_name']
                    ];
                }

                $responseBody[] = $shiftRow;
            }
        }
    }
}

send($responseBody);
