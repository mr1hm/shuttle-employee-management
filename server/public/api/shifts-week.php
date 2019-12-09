<?php
  require_once('../../lib/startup.php');
  require_once(AUTH);
  require_once(DATES);
  set_tz_la();

  $user = getRequestUser();

  if(!$user) {
    throw new ApiError(null, 401, 'Not Authorized');
  }

  $startDate = getLast('Sunday');
  $endDate = getNext('Saturday');

  if(isset($_GET['startDate']) && $_GET['endDate']) {
    $startDate = $_GET['startDate'];
    $endDate = $_GET['endDate'];
  }

  $stmt = $mysqli->prepare("SELECT * FROM `round` 
                            WHERE `user_id`= ? AND (`date` >= ? AND `date` <= ?)
                            ORDER BY `date`, `start_time` ASC");

  $stmt->bind_param('iss', $user['userId'], $startDate, $endDate);
  $stmt->execute();

  $result = $stmt->get_result();

  if(!$result){
    throw new ApiError(null, 500, 'Error getting week\'s schedule');
  }

  $data = [];
  while($row = $result->fetch_assoc()){
    $row['posted'] = $row['status'] === 'posted' ? true: false;
    unset($row['status']);
    $data[] = $row;
  }

  send($data);
