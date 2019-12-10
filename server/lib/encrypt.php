<?php
require_once(__DIR__.'/../config/encrypt.php');

function encrypt($data) {
  $dataString = json_encode($data);

  $cipher_method = 'aes-128-ctr';
  $enc_key = openssl_digest(ENC_SECRET, 'SHA256', 1);
  $enc_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher_method));
  
  return openssl_encrypt($dataString, $cipher_method, $enc_key, 0, $enc_iv).'::'.bin2hex($enc_iv);
}

function decrypt($token) {
  global $key;

  list($enc_token, $enc_iv) = explode('::', $token);
  $cipher_method = 'aes-128-ctr';
  $enc_key = openssl_digest(ENC_SECRET, 'SHA256', 1);
  $data = openssl_decrypt($enc_token, $cipher_method, $enc_key, 0, hex2bin($enc_iv));

  return json_decode($data, 1);
}
