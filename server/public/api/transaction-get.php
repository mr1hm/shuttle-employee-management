<?php
require_once('db_connection.php');
require_once('functions.php');
set_exception_handler('error_handler');

if(empty($_GET['entriesPerPage'])){
  $entriesPerPage = 3;
} else {
  $entriesPerPage = intval($_GET['entriesPerPage']);
}
if(empty($_GET['page'])){
  $page = 0;
} else {
  $page = intval($_GET['page']);
}

$query = "SELECT
  user.first_name, user.last_name,
  transaction.user_id, transaction.round_id,transaction.date,transaction.type,transaction.comment
  FROM `transaction`
    JOIN `user`
      ON `user`.`id` = `transaction`.`user_id`";
$queryPieces = [];
if(!empty($_GET['id'])){
  $queryPieces[] = "`user`.`id` = ". intval($_GET['id']);
}
if(!empty($_GET['type'])){
  $queryPieces[] = "transaction.type= '" . addslashes($_GET['type']) . "'";
}


$countQuery = "SELECT COUNT(*) AS itemCount
FROM `transaction`
    JOIN `user`
      ON `user`.`id` = `transaction`.`user_id`";
if (count($queryPieces)) {
  $query .= " WHERE " . implode(' AND ', $queryPieces);
  $countQuery .= " WHERE " . implode(' AND ', $queryPieces);
}

$countResult = mysqli_query($conn, $countQuery);
$itemCount = intval(mysqli_fetch_assoc($countResult)['itemCount']);
$totalPageCount = ceil($itemCount / $entriesPerPage);

$query .= " LIMIT $entriesPerPage OFFSET ". $entriesPerPage * $page;

$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}
$output = [
  'totalData'=>$itemCount,
  'totalPages'=>$totalPageCount,
  'currentPage'=>$page,
  'entriesPerPage'=>$entriesPerPage,
  'data'=>$data
];
print(json_encode($output));
