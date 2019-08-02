<?php
 require_once('functions.php');
 set_exception_handler('error_handler');
 require_once('db_connection.php');

 $query = "SELECT * FROM `shift` ORDER BY `id` ASC";
 $result = mysqli_query($conn, $query);
 //check if query was valid
  //if the result is an object, the query worked
  //if the result is false, the query failed
  if(!$result){
    throw new Exception('mysql error ' . mysqli_error($conn));
  }

//check how many rows of data were found (separate from the former check)
  //mysqli_num_rows
    //might want to throw an error or an empty array


//get the data from the result and put it into a variable
  //while row = mysqli_fetch_assoc (gives me one row at a time everytime I call it)
  $data = [];
  while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
  }
  print(json_encode($data));
//convert the data to json
//print the data

?>
