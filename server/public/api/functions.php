<?php
if (!function_exists('handleError')) {
  function error_handler($error)
  {
    http_response_code(500);
    $output = array(
      "success" => false,
      "error" => $error->getMessage()
    );
    $json_output = json_encode($output);
    print($json_output);
  }
}

?>
