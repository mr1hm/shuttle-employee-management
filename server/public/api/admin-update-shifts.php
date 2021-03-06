<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';

$data = getBodyData();
$user_id = (int)$data['user_id'];
$rounds = $data['rounds'];
$assign_status = $data['assign_status'];
$unassign_id = null;
$date = $data['date'];
$session = (int)$data['shifts'][0]['sessionId'];
$shifts = $data['shifts'];
if ($user_id === 1 && $assign_status === 'all'){
  $unassign_id = $data['unassign_id'];
}
$scheduled = 'scheduled';

if ($assign_status === 'single'){
  for ($rounds_index = 0; $rounds_index < count($rounds); $rounds_index++) {
    $current_round = (int) $rounds[$rounds_index];
    $rounds_string .= "$current_round";
    if ($rounds_index < count($rounds) - 1) {
      $rounds_string .= ", ";
    }
  }
  if ($user_id === 1) {
    $scheduled = 'unscheduled';
  }
  $query = "UPDATE `round`
            SET `user_id` = $user_id, `status` = '$scheduled'
            WHERE `id` IN ($rounds_string)";

  $result = mysqli_query($conn, $query);

} else if ($assign_status === 'all') {
  $query = "SELECT `session`.`endDateString` as 'end_date' FROM `session`
            WHERE `session`.`id` = $session";
  $result = mysqli_query($conn, $query);
  $row = mysqli_fetch_assoc($result);
  $end_date = $row['end_date'];

  if ($unassign_id) {
    for ($round_index = 0; $round_index < count($rounds); $round_index++) {
      for ($shift_round_index = 0; $shift_round_index < count($shifts[0]['rounds']); $shift_round_index++) {
        if ((int)$rounds[$round_index] === (int)$shifts[0]['rounds'][$shift_round_index]['id']) {
          $round_start = $shifts[0]['rounds'][$shift_round_index]['start'];
          $bus_info_id = $shifts[0]['bus_info_id'];
          for ($date_string = $date; $date_string < $end_date;) {
            echo $date_string;
            $query = "UPDATE `round`
                      SET `user_id` = 1, `status` = '$scheduled'
                      WHERE `user_id` = $unassign_id AND `bus_info_id` = $bus_info_id
                      AND `date` = '$date_string' AND `session_id` = $session
                      AND `start_time` = $round_start";
            $result = mysqli_query($conn, $query);
            if (!$result) {
              throw new Exception('mysql unassign all error: ' . mysqli_error($conn));
            }
            $date_string = date('Y-m-d', strtotime('+7 days', strtotime($date_string)));
            echo $date_string;
          }
        }
      }
    }
  } else {
    for ($shift_index = 0; $shift_index < count($shifts); $shift_index++) {
      $round_start = $shifts[$shift_index]['rounds'][0]['start'];
      $bus_info_id = $shifts[$shift_index]['bus_info_id'];
      for ($date_string = $date; $date_string < $end_date;) {
        $query = "UPDATE `round`
                  SET `user_id` = $user_id, `status` = '$scheduled'
                  WHERE `user_id` = 1 AND `bus_info_id` = $bus_info_id
                  AND `date` = '$date_string' AND `session_id` = $session
                  AND `start_time` = $round_start";
        $result = mysqli_query($conn, $query);
        if (!$result) {
          throw new Exception('mysql assign all error: ' . mysqli_error($conn));
        }
        $date_string = date('Y-m-d', strtotime('+7 days', strtotime($date_string)));
      }
    }
  }
}

if (!$result) {
  throw new Exception('mysql error: ' . mysqli_error($conn));
}

?>
