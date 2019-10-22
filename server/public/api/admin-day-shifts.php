<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

// $date= $_GET['date'];

// $date = 1566273600;

$query = "SELECT
          rd.id AS round_id,
          rt.line_name,
          bi.bus_number,
          rd.start_time AS round_start,
          rd.end_time AS round_end,
          us.id AS user_id,
          us.last_name,
          us.first_name,
          us.special_route_ok,
          rd.date,
          rd.status
          FROM route AS rt
          JOIN bus_info AS bi ON bi.route_id = rt.id
          JOIN round AS rd ON rd.bus_info_id = bi.id
          JOIN user AS us ON rd.user_id = us.id
          WHERE rd.date = 1566619200
          ORDER BY line_name ASC, bus_number ASC, round_start ASC";

$result = mysqli_query($conn, $query);
if (!$result) {
    throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// rounds grouped by line and bus;
$grouped_data = [];
for ($data_index = 0; $data_index < count($data); $data_index++){
    $current_data = $data[$data_index];
    for ($grouped_index = 0; $grouped_index < count($grouped_data); $grouped_index++){
        $group = $grouped_data[$grouped_index];
        if (empty($current_group['line_name'])){
            $group['line_name'] = $data[$data_index]['line_name'];;
            $group['bus_number'] = $current_data['bus_number'];
            $group['shifts'] = [];
            $group['shifts'][] = [
                'user_id' => $data[$data_index]['user_id'],
                'user_name' => [
                    'first' => $data[$data_index]['first_name'],
                    'last' => $data[$data_index]['last_name']
                ],
                'line_bus_name' => $data[$data_index]['line_name'] . $data[$data_index]['bus_number'],
                'round_id' => $data[$data_index]['round_id'],
                'rounds' => [$data[$data_index]['round_id']],
                'start_time' => $data[$data_index]['round_start'],
                'end_time' => $data[$data_index]['round_end']
            ];
        break;
        }
    }
}


print(json_encode($data));
?>
