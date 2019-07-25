<?php
if(!function_exists('handleError')){
  function handleError($error) {
  http_response_code(500);
  $output = [
    'success'=>false, 
    'error'=> $error->getMessage()
  ];
  $json_output = json_encode($output);
  print($json_output);
  }
}

function getBodyData() {
  $data = file_get_contents('php://input');
  return $data = json_decode($data, true);
}
?>

