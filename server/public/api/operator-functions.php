<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once 'db_connection.php';
require_once('shift-restrictions.php');

/**
 *
 */
function getOperator ($operator_id, $date) {

  // 1. Determine week start & week end based off given date
    // 1. Query `round` table to get all round time data for operator
    //    in calculated week
    // 2. Add up all of the operators scheduled round minutes
    // 3. Store in variable to be used as total weekly minutes
  // 2. Query `user`, `operator_availability`, `round` tables for
    // 1. Get `user_id`, `first_name`, `last_name`, `special_status`
    //    from `user` table
    // 2. Get available times from `operator_availability` table
    // 3. Get assigned times for the given day from the `round` table
  // 3. Build operator structure like this |
  //                                       V
    // {
    //   user_id: 4,
    //   last_name: "Wu",
    //   first_name: "Teresa",
    //   special_route: 0,
    //   assigned_times: [],
    //   available_times: [],
    //   shift_restrictions: {
    //     worked_passed_10: {
    //       prior_day: false,
    //       current_day: false
    //     },
    //     shift_passed_15_hour_window: {
    //       shift_start: 0
    //     }
    //   },
    //   total_daily_minutes: 0,
    //   total_weekly_minutes: 0,
    //   minutes_without_30_minute_break: 0
    // }
  // 4. Return constructed operator
}

// Helper functions

function determineWeeklyMinutes (int $operator_id, $date) {
  global $conn;
  $week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  $day = date('D', $date);
  $weekStart = null;
  $weekEnd = null;
  foreach ( $week as $index => $weekDay ) {
    if ( $day === $weekDay ) {
      $weekStart = strtotime("-$index days", $date);
      $difference = count($week) - $index - 1;
      $weekEnd = strtotime("+$difference days", $date);
      break;
    }
  }
  unset($weekDay);

  $query = "SELECT `start_time`, `end_time`
            FROM `round`
            WHERE `user_id` = {$operator_id} AND
                  `date` >= {$weekStart} AND `date` <= {$weekEnd}";
  $result = mysqli_query($conn, $query);
  if (!$result) {
    throw new Exception('MySQL error: ' . mysqli_error($conn));
  }
  $weeklyMinutes = 0;
  while ( $row = mysqli_fetch_assoc($result) ) {
    $weeklyMinutes += calculateShiftMinutes($row['start_time'], $row['end_time']);
  }

  return intval( $weeklyMinutes );
}
// 1566619200
// print(determineWeeklyMinutes(10, 1566446400));
print(determineWeeklyMinutes(10, 1566100800));

?>
