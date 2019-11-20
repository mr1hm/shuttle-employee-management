function convertMilitaryTime(militaryTime) { // takes a string military time (eg "0600") and converts to meridian time (eg "6:00 AM")
  if (militaryTime.length < 4) {
    militaryTime = '0' + militaryTime;
  }
  let hour = parseInt(militaryTime.slice(0, 2));
  const minute = militaryTime.slice(2);
  let meridiem;
  if (hour < 12) {
    meridiem = 'AM';
  } else {
    meridiem = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  }
  return hour + ':' + minute + ' ' + meridiem;
}
function adjustLocalTimestampToUTCSeconds(localMillisecondsTimeStamp) { // adjusts local timestamp (msec) [number or string] to UTC then converts to 10-digit timestamp (sec) [number]
  const timestampUTCmilliseconds = parseInt(localMillisecondsTimeStamp) + 100800000;
  return timestampUTCmilliseconds / 1000;
  // NOTE: this function combines the convertMillisecondsToSeconds function
  // should be used when needing to convert front-end generated 13-digit timestamps to a 10-digit UTC timestamp (since front-end generated timestamps are not in UTC)
}
function adjustUTCSecondsToLocalTimestamp(utcSecondsTimestamp) { // the reverse of the above function (adjustLocalTimestampToUTCSeconds)
  const utcMillisecondsTimestamp = parseInt(utcSecondsTimestamp) * 1000;
  return parseInt(utcMillisecondsTimestamp) - 100800000;
  // NOTE: the purpose of this function is to get timestamps from the back-end or db (seconds / UTC) and convert to a 13-digit local time timestamp (milliseconds)
  // also note that this function incorporates the convertSecondsToMilliseconds function below
}
function convertSecondsToMilliseconds(secondsTimestamp) { // convert timestamp (seconds) [number or string] to timestamp (milliseconds) [string]
  return secondsTimestamp + '000'; // example: input 1566100800, output "1566100800000"
}
function convertMillisecondsToSeconds(millisecondsTimestamp) { // convert timestamp (milliseconds) to number timestamp (seconds)
  return parseInt(millisecondsTimestamp) / 1000; // example: input 1566100800000, output 1566100800
  // NOTE: the result of this function is a NUMBER so if you need the timestamp as a STRING, be sure to concat with empty string ( + "" ) when using.
}
function convertUnixTime(time) { // converts unix time to date/time for example: input:convertUnixTime(1568670748829)
  const convertedDate = new Date(time);
  return convertedDate.toString();// output: "Mon Sep 16 2019 14:52:28 GMT-0700 (Pacific Daylight Time)"
}
function convertUnixMonthDay(time) { // input:convertUnixMonthDay(156859200) 09/17/2019
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear() + '-' + ('0' + getTheDate.getDate()).slice(-2) +
    '-' + ('0' + (getTheDate.getMonth() + 1)).slice(-2);
  return dateString;// Output: "1970-02-01"
}
function convertUnixDateDay(time) { // converts unix time to specific day of the week example: input: convertUnixDateDay(1568670748829)
  const convertedDate = new Date(time);
  const dateString = '' + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[0].toUpperCase();// output: "MON"
}
function convertUnixDateNumber(time) { // converts unix time to specific day of the month example: input: convertUnixDateNumber(1568670748829)
  const convertedDate = new Date(time);
  const dateString = '' + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[2];// output: 16
}
function getShiftStartHour(time) { // converts unix time to dayOfTheWeek/Month/dayOfTheMonth/year/hour example: input:getShiftStartHour(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];// output: Mon Sep 16 2019 14
}
function getShiftStartMinute(time) { // converts unix time to current minutes example: input:getShiftStartMinute(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];// output: 52
}
function getShiftEndHour(time) { // converts unix time to dayOfTheWeek/Month/dayOfTheMonth/year/hour example: input:getShiftStartHour(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];// output: Mon Sep 16 2019 14
}
function getShiftEndMinute(time) { // converts unix time to current minutes example: input:getShiftStartMinute(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];// output: 52
}// 1568676748829
function calculateDailyWorkingHours(startTime, endTime) { // not working Uncaught TypeError: startTime.slice is not a function
  if (startTime.length < 4) {
    startTime = '0' + startTime;
    parseInt(startTime);
  }
  if (endTime.length < 4) {
    endTime = '0' + endTime;
    parseInt(endTime);
  }

  const startHour = startTime.slice(0, 2);
  const endHour = endTime.slice(0, 2);
  const startMinute = startTime.slice(2);
  const endMinute = endTime.slice(2);

  const startMinutesAsRatio = parseFloat(startMinute) / 60;
  const endMinutesAsRatio = parseFloat(endMinute) / 60;
  const startTimeFloat = parseInt(startHour) + startMinutesAsRatio;
  const endTimeFloat = parseInt(endHour) + endMinutesAsRatio;
  const shiftHoursPerDay = endTimeFloat - startTimeFloat;
  const shiftHoursPerDayFixed = shiftHoursPerDay.toFixed(2);
  return shiftHoursPerDayFixed;
}
/* converts a YYYY-MM-DD date string into a js date object set to midnight on the same day LOCAL time
params:
  dateString(string) : a YYYY-MM-DD formatted string
  returns: a js date object
*/
function convertMilitaryTimeStringToMilitaryTimeFloat(time) {
  // converts '1430' to 14.5
  // '1245' to 12.75
  while (time.length < 4) {
    time = '0' + time;
  }
  const hour = parseInt(time.slice(0, 2));
  const minutes = parseInt(time.slice(2)) / 60;
  return hour + minutes;

}
function zeroPadNumber(number, length = 2) { // converts unix time from number to string example: input:1568670748829
  number += '';
  while (number.length < length) {
    number = '0' + number;
  }
  return number;// output: "1568670748829"
}
function calculateShiftHours(startTime, endTime) { // takes two string military time numbers and calculates total number of minutes example: input: calculateShiftHours("600","720")
  let startHourDigits = Math.trunc(parseInt(startTime) / 100);
  let startMinuteDigits = parseInt(startTime.slice(-2));
  let endHourDigits = Math.trunc(parseInt(endTime / 100));
  let endMinuteDigits = parseInt(endTime.slice(-2));
  let shiftLengthInMinutes = ((endHourDigits - startHourDigits) * 60) + (endMinuteDigits - startMinuteDigits);
  return Math.round(shiftLengthInMinutes);// Output: 80
}

function createDateStringFromDateObject(dateObject) { // not working zeroPadNumber is not defined // This seems to be the same as convertUnixMonthDay
  if (typeof dateObject === 'number') {
    dateObject = new Date(dateObject);
  }
  const stringDate = `${dateObject.getFullYear()}-${zeroPadNumber(dateObject.getMonth() + 1)}-${zeroPadNumber(dateObject.getDate())}`;
  return stringDate;
}

function createDateObjFromDateString(dateString, setToMidnight = true) { // converts unix time to date/at midnight example: input: createDateObjFromDateString(1568670748829)
  let date = new Date();
  if (typeof dateString === 'number') { // the dateString is actually a timestamp
    date.setTime(dateString);
  } else if (typeof dateString === 'string') {
    const dateParams = dateString.split('-').map(segment => parseInt(segment));
    date.setFullYear(dateParams[0], dateParams[1] - 1, dateParams[2]);
  }
  if (setToMidnight) {
    date.setHours(0, 0, 0, 0);
  }
  return date;// output: Mon Sep 16 2019 00:00:00 GMT-0700 (Pacific Daylight Time)
}

function getTotalDayWorkingHours(props) {
  let hourTotal = 0;
  for (var i = 0; i < props.length; i++) {

    if (props[i].restricted === true) {
      continue;
    }
    const hoursPerShift = calculateDailyWorkingHours(props[i].startTime, props[i].endTime);
    hourTotal += hoursPerShift;
  }

  if (hourTotal === 1) {
    return hourTotal + ' Hour';
  } else {
    return hourTotal + ' Hours';
  }
}

function calcShiftLenghtInHourMinFormat(startOfShift, endOfShift) {

  function calcShiftHours(startTime, endTime) { // 1220, 1240
    let startHourDigits = Math.trunc(startTime / 100);// 12
    let startMinuteDigits = Math.round((startTime / 100 - Math.floor(startTime / 100)) * 100);// 20
    let endHourDigits = Math.trunc(endTime / 100); // 12
    let endMinuteDigits = Math.round((endTime / 100 - Math.floor(endTime / 100)) * 100); // 40
    let startTimeInMinutes = startHourDigits * 60 + startMinuteDigits; // 600 + 20 = 620
    let endTimeInMinutes = endHourDigits * 60 + endMinuteDigits; // 720 + 20 = 740
    let shiftLengthInMinutes = endTimeInMinutes - startTimeInMinutes; // 740 - 620 = 120
    return Math.round(shiftLengthInMinutes); // 120 min
  }

  let totalShiftLengthForWeek = 0; // initial hours
  let minutesForShift = calcShiftHours(startOfShift, endOfShift); // 120 minutes
  totalShiftLengthForWeek += minutesForShift;
  let totalHours = Math.floor(totalShiftLengthForWeek / 60); // 2
  let totalMinutes = totalShiftLengthForWeek % 60; // 0
  return (totalHours + 'h ' + totalMinutes + 'm');
}

function createDateObject(unix) {
  const dates = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  const timestamp = unix * 1000;
  const date = new Date(timestamp);
  const weekday = dates.weekdays[date.getDay()];
  const month = dates.months[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();

  return {
    day,
    month,
    year,
    weekday
  };
}
/**
 * global month, day and 3 letter day arrays
 */
const globalMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const globalDayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const globalDayOfWeekShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * takes one param and integer and returns a number with a leading 0 if number < 10
 */
function getZeroPaddedNumber(num) {
  return num < 10 ? '0' + num : num;
}

function getDateString(dateObj) {
  return `${dateObj.getUTCFullYear()}-${getZeroPaddedNumber(dateObj.getUTCMonth() + 1)}-${getZeroPaddedNumber(dateObj.getUTCDate())}`;
}

/**
 * takes one param timestamp that can be a unix timestamp or a string timestamp
 * returns an object with year, month(0-11), date(1-31) and day(0-6) represented as numbers
 * and names of month, day and 3 letter version of day
 */
function getUTCYearMonthDateDay(timestamp) {
  const UTCDate = new Date(timestamp);
  const year = UTCDate.getUTCFullYear();
  const month = UTCDate.getUTCMonth();
  const date = UTCDate.getUTCDate();
  const day = UTCDate.getUTCDay();
  const UTCDateObj = {
    timestamp: timestamp,
    year: year,
    month: month,
    date: date,
    day: day,
    monthName: globalMonth[month],
    dayName: globalDayOfWeek[day],
    dayNameShort: globalDayOfWeekShort[day],
    dateString: `${year}-${getZeroPaddedNumber(month + 1)}-${getZeroPaddedNumber(date)}`
  };
  return UTCDateObj;
}

/**
 * takes one param unixTimestamp that can be any day of the week
 * returns an array of 7 objects, one per day of week (sun - sat)
 * each object includes day, date object and unix timestamps of one day
 */
function returnWeekInfoArray(dateString) {
  const dateObj = new Date(dateString);
  const day = dateObj.getUTCDay();
  const weekArray = [];
  for (let weekIndex = 0; weekIndex < 7; weekIndex++) {
    const currentDateObj = new Date(dateString);
    currentDateObj.setUTCDate(dateObj.getUTCDate() + weekIndex - day);
    const weekArrayItem = {
      month: globalMonth[currentDateObj.getUTCMonth()],
      day: globalDayOfWeek[weekIndex],
      date: currentDateObj,
      dateString: getDateString(currentDateObj)
    };
    weekArray.push(weekArrayItem);
  }
  console.log(weekArray);
  return weekArray;
}

export { getDateString, getZeroPaddedNumber, getUTCYearMonthDateDay, returnWeekInfoArray, createDateObject, convertMilitaryTime, adjustLocalTimestampToUTCSeconds, adjustUTCSecondsToLocalTimestamp, convertSecondsToMilliseconds, convertMillisecondsToSeconds, convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours,
  createDateObjFromDateString, calcShiftLenghtInHourMinFormat, convertMilitaryTimeStringToMilitaryTimeFloat,
  createDateStringFromDateObject, zeroPadNumber, convertUnixMonthDay, calculateShiftHours };
