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
bi.bus_number,
rnd.*
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
AND u.id != :user_id
