<?php
define('DATE_FORMAT', 'Y-m-d');

function getFirstDayOfCurrentMonth() {
  return date(DATE_FORMAT, strtotime('first day of '.date('Y-m')));
}

function getLastDayOfCurrentMonth() {
  return date(DATE_FORMAT, strtotime('last day of '.date('Y-m')));
}

function getLast($day) {
  $today =  strtolower(date('l'));

  if($today === strtolower($day)) {
    return getToday();
  }

  $last = strtotime("last $day");

  return date(DATE_FORMAT, $last);
}

function getNext($day) {
  $today =  strtolower(date('l'));

  if($today === strtolower($day)) {
    return getToday();
  }

  $next = strtotime("next $day");

  return date(DATE_FORMAT, $next);
}

function getToday() {
  return date(DATE_FORMAT);
}

function getFormattedDate($date){
  return date(DATE_FORMAT, strtotime($date));
}

function set_tz_la() {
  date_default_timezone_set('America/Los_Angeles');
}

set_tz_la();
