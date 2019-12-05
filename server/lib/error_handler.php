<?php

class ApiError extends Exception {
    private $output;
    public function __construct($output = [], $code = 500, $message = 'internal server error', Exception $previous = null ){
        $this->output = $output;
        parent::__construct($message, $code, $previous);
    }
    public function sendError(){
        if(empty($this->output['error']) && empty($this->output['errors'])){
            $this->output['error'] = $this->message;
        }
        http_response_code($this->code);
        header('Content-Type: application/json');
        print json_encode($this->output);
        
        die();
    }
}
function defaultExceptionHandler($ex){
    if($ex instanceof ApiError){
        $ex->sendError();
    }
    
    print_r($ex);
}
set_exception_handler('defaultExceptionHandler');
