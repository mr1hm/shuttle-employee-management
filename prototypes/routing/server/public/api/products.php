<?php

header('Content-Type: application/json');

require('functions.php');

set_exception_handler('handleError');

require_once('db_connection.php');

if (!empty($_GET['id'])) {

  if (!is_numeric($_GET['id'])) {
    throw new Exception('id needs to be a number');
  } 
  $incomingId = $_GET['id'];
  $whereClause = " WHERE products.id = " . $incomingId;

  $query = "SELECT 
            products.name, 
            products.price, 
            products.shortDescription, 
            products.longDescription,
            GROUP_CONCAT(images.image) 
            AS images 
            FROM products 
            JOIN images ON products.id = images.product_id 
            $whereClause 
            GROUP BY products.id";

  $result = mysqli_query($conn, $query);

  if(!$result) {
    throw new Exception('error with query: ' . mysqli_error($conn));
  }
  
  $data = mysqli_fetch_assoc($result);
 
  $data['images'] = explode(',', $data['images']);

  print(json_encode($data));

} else {

  $query = "SELECT products.id,
                   products.name,
                   products.price,
                   products.shortDescription,
                   (SELECT image
                      FROM images
                     WHERE product_id = products.id
                     LIMIT 1) AS image
              FROM products";

  $result = mysqli_query($conn, $query);

  if(!$result) {
    throw new Exception('error with query: ' . mysqli_error($conn));
  }
    
  $data = [];
  while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
  }

  print(json_encode($data));
}
?>
