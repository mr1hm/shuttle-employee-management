function adjustLocalTimestampToUTCSeconds (localMillisecondsTimeStamp) {  // adjusts local timestamp (msec) [number or string] to UTC then converts to 10-digit timestamp (sec) [number]
  const timestampUTCmilliseconds = parseInt(localMillisecondsTimeStamp) - 10800000;
  return timestampUTCmilliseconds / 1000;
  // NOTE: this function combines the convertMillisecondsToSeconds function
  // should be used when needing to convert front-end generated 13-digit timestamps to a 10-digit UTC timestamp (since front-end generated timestamps are not in UTC)
}
function convertSecondsToMilliseconds(secondsTimestamp) { // convert timestamp (seconds) [number or string] to timestamp (milliseconds) [string]
  return secondsTimestamp + "000"; // example: input 1566100800, output "1566100800000"
}
function convertMillisecondsToSeconds(millisecondsTimestamp) { // convert timestamp (milliseconds) to number timestamp (seconds)
  return parseInt(millisecondsTimestamp) / 1000; // example: input 1566100800000, output 1566100800
  // NOTE: the result of this function is a NUMBER so if you need the timestamp as a STRING, be sure to concat with empty string ( + "" ) when using.
}
function convertUnixTime(time) {// converts unix time to date/time for example: input:convertUnixTime(1568670748829)
  const convertedDate = new Date(time);
  return convertedDate.toString();// output: "Mon Sep 16 2019 14:52:28 GMT-0700 (Pacific Daylight Time)"
}
function convertUnixMonthDay(time) {// This could be added to time-function.jsx  input:convertUnixMonthDay(156859200) 09/17/2019
  const getTheDate = new Date(time);
  const dateString = getTheDate.getFullYear() + '-' + ('0' + getTheDate.getDate()).slice(-2)
    + '-' + ('0' + (getTheDate.getMonth() + 1)).slice(-2);
  return dateString;// Output: "1970-02-01"
}
function convertUnixDateDay(time) {// converts unix time to specific day of the week example: input: convertUnixDateDay(1568670748829)
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[0].toUpperCase();// output: "MON"
}
function convertUnixDateNumber(time) {// converts unix time to specific day of the month example: input: convertUnixDateNumber(1568670748829)
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[2];// output: 16
}
function getShiftStartHour(time) {// converts unix time to dayOfTheWeek/Month/dayOfTheMonth/year/hour example: input:getShiftStartHour(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];// output: Mon Sep 16 2019 14
}
function getShiftStartMinute(time) {//converts unix time to current minutes example: input:getShiftStartMinute(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];// output: 52
}
function getShiftEndHour(time) {// converts unix time to dayOfTheWeek/Month/dayOfTheMonth/year/hour example: input:getShiftStartHour(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];// output: Mon Sep 16 2019 14
}
function getShiftEndMinute(time) {//converts unix time to current minutes example: input:getShiftStartMinute(1568670748829)
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];// output: 52
}//1568676748829
function calculateDailyWorkingHours(startTime, endTime) {// not working Uncaught TypeError: startTime.slice is not a function
  if (startTime.length < 4){
    startTime = "0" + startTime;
    parseInt(startTime);
  }
  if (endTime.length < 4) {
    endTime = "0" + endTime;
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
  //converts '1430' to 14.5
  // '1245' to 12.75
  while( time.length < 4){
    time = '0'+time;
  }
  const hour = parseInt(time.slice(0,2));
  const minutes = parseInt(time.slice(2)) / 60;
  return hour+minutes;

}
function zeroPadNumber(number, length = 2) {// converts unix time from number to string example: input:1568670748829
  number += '';
  while(number.length < length){
    number = '0' + number;
  }
  return number;// output: "1568670748829"
}
function calculateShiftHours(startTime, endTime) {// takes two string military time numbers and calculates total number of minutes example: input: calculateShiftHours("600","720")
  let startHourDigits = Math.trunc(parseInt(startTime) / 100);
  let startMinuteDigits = parseInt(startTime.slice(-2));
  let endHourDigits = Math.trunc(parseInt(endTime / 100));
  let endMinuteDigits = parseInt(endTime.slice(-2));
  let shiftLengthInMinutes = ((endHourDigits - startHourDigits) * 60) + (endMinuteDigits - startMinuteDigits);
  return Math.round(shiftLengthInMinutes);// Output: 80
}
function createDateStringFromDateObject(dateObject) {// not working zeroPadNumber is not defined // This seems to be the same as convertUnixMonthDay
  // if (!dateObject){
  //   return;
  // }
  if (typeof dateObject === 'number'){
    dateObject= new Date(dateObject);
  }
  const stringDate = `${dateObject.getFullYear()}-${zeroPadNumber(dateObject.getMonth()+1)}-${zeroPadNumber(dateObject.getDate())}`;
  return stringDate;
}
function createDateObjFromDateString(dateString, setToMidnight = true) {// converts unix time to date/at midnight example: input: createDateObjFromDateString(1568670748829)
  let date = new Date();
  if( typeof dateString === 'number'){ //the dateString is actually a timestamp
    date.setTime(dateString);
  } else if(typeof dateString==='string'){
    const dateParams = dateString.split('-').map( segment => parseInt(segment));
    date.setFullYear(dateParams[0], dateParams[1] - 1, dateParams[2] );
  }
  if (setToMidnight) {
    date.setHours(0, 0, 0, 0);
  }
  return date;// output: Mon Sep 16 2019 00:00:00 GMT-0700 (Pacific Daylight Time)
}

function getTotalDayWorkingHours(props) {
  let hourTotal = 0;
  for (var i = 0; i < props.length; i++){

    if (props[i].restricted === true){
      continue;
    }
    const hoursPerShift = calculateDailyWorkingHours(props[i].startTime, props[i].endTime);
    hourTotal += hoursPerShift;
  }

  if (hourTotal === 1){
    return hourTotal + ' Hour';
  } else {
     return hourTotal + ' Hours';
  }
}


//calculates total shift duration and formats it in XXh YYmin
// function calcShiftLenghtInHourMinFormat(startOfShift,endOfShift){// example input: calcShiftLenghtInHourMinFormat(1568670748829,1568676748829)

//   function calcShiftHours(startTime, endTime){
//     let startHourDigits = Math.trunc(startTime/100);
//     let startMinuteDigits = startTime/100 - Math.floor(startTime/100);
//     let endHourDigits = Math.trunc(endTime/100);
//     let endMinuteDigits = endTime/100 - Math.floor(endTime/100);
//     let startTimeInMinutes = startHourDigits*60 + startMinuteDigits;
//     let endTimeInMinutes = endHourDigits*60 + endMinuteDigits;
//     let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;
//     return Math.round(shiftLengthInMinutes);
//   }

//     let totalShiftLengthForWeek = 0
//     let minutesForShift = calcShiftHours(startOfShift,endOfShift);
//     totalShiftLengthForWeek += minutesForShift;
//     let totalHours = Math.floor(totalShiftLengthForWeek/60);
//     let totalMinutes = totalShiftLengthForWeek%60;
//     return (totalHours + "h " + totalMinutes + "m");
// }
function calcShiftLenghtInHourMinFormat(startOfShift, endOfShift) {

  function calcShiftHours(startTime, endTime) { // 1220, 1240
    let startHourDigits = Math.trunc(startTime / 100);//12
    let startMinuteDigits = Math.round((startTime / 100 - Math.floor(startTime / 100)) * 100);//20
    let endHourDigits = Math.trunc(endTime / 100); // 12
    let endMinuteDigits = Math.round((endTime / 100 - Math.floor(endTime / 100)) * 100); //40
    let startTimeInMinutes = startHourDigits * 60 + startMinuteDigits; //600 + 20 = 620
    let endTimeInMinutes = endHourDigits * 60 + endMinuteDigits; // 720 + 20 = 740
    let shiftLengthInMinutes = endTimeInMinutes - startTimeInMinutes; //740 - 620 = 120
    return Math.round(shiftLengthInMinutes); // 120 min
  }

  let totalShiftLengthForWeek = 0 //initial hours
  let minutesForShift = calcShiftHours(startOfShift, endOfShift); // 120 minutes
  totalShiftLengthForWeek += minutesForShift;
  let totalHours = Math.floor(totalShiftLengthForWeek / 60); //2
  let totalMinutes = totalShiftLengthForWeek % 60; //0
  return (totalHours + "h " + totalMinutes + "m");
}

export { adjustLocalTimestampToUTCSeconds, convertSecondsToMilliseconds, convertMillisecondsToSeconds, convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours,
  createDateObjFromDateString, calcShiftLenghtInHourMinFormat, convertMilitaryTimeStringToMilitaryTimeFloat,
    createDateStringFromDateObject, zeroPadNumber, convertUnixMonthDay, calculateShiftHours };
