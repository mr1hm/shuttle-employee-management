<?php
require_once('functions.php');
set_exception_handler('error_handler');
require_once('db_connection.php');
$id = $_POST['userID'];
$target_dir = '../assets/images/profile/user id/'.$id;
$exist = is_dir($target_dir);
if(!$exist){
  mkdir("$target_dir");
  chmod("$target_dir", 0755);
}else{
  $folder = $target_dir;
  $files = glob($folder.'/*');
  foreach ($files as $file) {
    if (is_file($file)) {
      unlink($file);
    }
  }
  echo "Folder already exist";
}
$target_file = $target_dir . '/' . basename($_FILES['fileName']['name']);
$uploadOK = true;
$output = [];
  if($_FILES['fileName']['size'] > 500000){
    $uploadOK = false;
    $output['error'][] = 'The seleted file is too large';
  }
if($uploadOK){
  if(move_uploaded_file($_FILES["fileName"]['tmp_name'], $target_file)){
    $output['success'] = true;
    $output['filepath'] = stripcslashes($target_file);
    $output['success msg'] = "The file ".$_FILES["fileName"]["name"]." has been uploaded.";
  }else{
    $output['errors'][] = "There was an error uploading your file.";
  }
}
echo json_encode($output);
$query = "UPDATE user SET user.url ='$target_file'
WHERE id =" . $id;
$result = mysqli_query($conn, $query);
if (!$result) {
  throw new Exception('mysql error ' . mysqli_error($conn));
}
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
  $data[] = $row;
}
print(json_encode($data));
?>