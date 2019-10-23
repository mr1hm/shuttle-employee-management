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
    $grouped_data_length = count($grouped_data);
    for ($grouped_index = 0; $grouped_index <= $grouped_data_length; $grouped_index++){
        if ($grouped_index === $grouped_data_length){
            $new_group_item = [];
            $new_group_item['line_name'] = $current_data['line_name'];;
            $new_group_item['bus_number'] = $current_data['bus_number'];
            $new_group_item['shifts'] = [];
            $grouped_data[] = $new_group_item;
        }
        $group_item = &$grouped_data[$grouped_index];
        if ($group_item['line_name'] === $current_data['line_name'] &&
            $group_item['bus_number'] === $current_data['bus_number']){
            $group_item['shifts'][] = [
                'user_id' => (int) $current_data['user_id'],
                'user_name' => [
                    'first' => $current_data['first_name'],
                    'last' => $current_data['last_name']
                ],
                'line_bus_name' => $current_data['line_name'] . $current_data['bus_number'],
                'round_id' => (int) $current_data['round_id'],
                'rounds' => [
                    [
                        'id' => (int) $current_data['round_id'],
                        'start' => (int) $current_data['round_start'],
                        'end' => (int) $current_data['round_end']
                        ]
                ],
                'start_time' => (int) $current_data['round_start'],
                'end_time' => (int) $current_data['round_end']
            ];
            break;
        }
    }
}
// put shifts in order by time
for ($group_index = 0; $group_index < count($grouped_data); $group_index++){
    $shifts = $grouped_data[$group_index]['shifts'];
    $ordered_shifts = [];
    for($shift_index = 0; $shift_index < count($shifts); $shift_index++){
        $shift = $shifts[$shift_index];
        $ordered_shifts_length = count($ordered_shifts);
        for($ordered_shifts_index = 0; $ordered_shifts_index <= $ordered_shifts_length; $ordered_shifts_index++){
            if ($ordered_shifts_index === $ordered_shifts_length) {
                $ordered_shifts[] = $shift;
                break;
            }
            if ($shift['start_time'] < $ordered_shifts[$ordered_shifts_index]['start_time']){
                array_splice($ordered_shifts, $ordered_shifts_index, 0, $shift);
                break;
            }
        }
    }
    $grouped_data[$group_index]['shifts'] = $ordered_shifts;
}
// group consecutive shifts for user_id on same line and bus
for ($group_index = 0; $group_index < count($grouped_data); $group_index++) {
    $shifts = &$grouped_data[$group_index]['shifts'];
    $previous_shift_id = null;
    $previous_shift_end = null;
    for ($shift_index = 0; $shift_index < count($shifts); $shift_index++) {
        $shift = $shifts[$shift_index];
        if($shift['user_id'] === $previous_shift_id && $shift['start_time'] === $previous_shift_end && $shift['user_id'] !== 1){
            $shifts[$shift_index - 1]['end_time'] = $shift['end_time'];
            $shifts[$shift_index - 1]['rounds'][] = [
                'id' => $shift['round_id'],
                'start' => $shift['start_time'],
                'end' => $shift['end_time']
            ];
            array_splice($shifts, $shift_index, 1);
            $shift_index--;
        } else {
            $previous_shift_id = $shift['user_id'];
        }
        $previous_shift_end = $shift['end_time'];

    }
}
// add non-operational shifts if needed
for ($group_index = 0; $group_index < count($grouped_data); $group_index++) {
    $shifts = &$grouped_data[$group_index]['shifts'];
    if ($shifts[0]['start_time'] !== 600){
        $shift_to_add = [
            'user_id' => 'n/a',
            'line_bus_name' => $shifts[0]['line_bus_name'],
            'round_id' => 'n/a',
            'rounds' => ['n/a'],
            'start_time' => 600,
            'end_time' => $shifts[0]['start_time']
        ];
        array_unshift($shifts, $shift_to_add);
    }
    $last_index = count($shifts) - 1;
    if ($shifts[$last_index]['end_time'] !== 2400){
        $shift_to_add = [
            'user_id' => 'n/a',
            'line_bus_name' => $shifts[$last_index]['line_bus_name'],
            'round_id' => 'n/a',
            'rounds' => ['n/a'],
            'start_time' => $shifts[$last_index]['end_time'],
            'end_time' => 2400
        ];
        $shifts[] = $shift_to_add;
    }
}
print(json_encode($grouped_data));

?>
