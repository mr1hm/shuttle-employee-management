function convertUnixTime(time) {
  const convertedDate = new Date(time);
  return convertedDate.toString();
}
function convertUnixDateDay(time) {
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[0].toUpperCase();
}
function convertUnixDateNumber(time) {
  const convertedDate = new Date(time);
  const dateString = "" + convertedDate;
  const arrayDateString = dateString.split(' ');
  return arrayDateString[2];
}
function getShiftStartHour(time) {
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];
}
function getShiftStartMinute(time) {
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];
}
function getShiftEndHour(time) {
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[0];
}
function getShiftEndMinute(time) {
  const timeResult = convertUnixTime(time);
  const splitTimeResult = timeResult.split(':');
  return splitTimeResult[1];
}
function calculateDailyWorkingHours(startTime, endTime) {
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
  return shiftHoursPerDay;
}
/* converts a YYYY-MM-DD date string into a js date object set to midnight on the same day LOCAL time
params:
  dateString(string) : a YYYY-MM-DD formatted string
  returns: a js date object
*/
function convertMilitaryTimeStringToMilitaryTimeFloat( time ){
  //converts '1430' to 14.5
  // '1245' to 12.75
  while( time.length < 4){
    time = '0'+time;
  }
  const hour = parseInt(time.slice(0,2));
  const minutes = parseInt(time.slice(2)) / 60;
  return hour+minutes;

}
function zeroPadNumber( number, length=2){
  number += '';
  while(number.length < length){
    number = '0' + number;
  }
  return number;
}
function createDateStringFromDateObject( dateObject ){
  // if (!dateObject){
  //   return;
  // }
  if (typeof dateObject === 'number'){
    dateObject= new Date(dateObject);
  }
  const stringDate = `${dateObject.getFullYear()}-${zeroPadNumber(dateObject.getMonth()+1)}-${zeroPadNumber(dateObject.getDate())}`;
  return stringDate;
}
function createDateObjFromDateString( dateString, setToMidnight=true ){
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
  return date;
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
function calcShiftLenghtInHourMinFormat(startOfShift,endOfShift){

  function calcShiftHours(startTime, endTime){
    let startHourDigits = Math.trunc(startTime/100);
    let startMinuteDigits = startTime/100 - Math.floor(startTime/100);
    let endHourDigits = Math.trunc(endTime/100);
    let endMinuteDigits = endTime/100 - Math.floor(endTime/100);
    let startTimeInMinutes = startHourDigits*60 + startMinuteDigits;
    let endTimeInMinutes = endHourDigits*60 + endMinuteDigits;
    let shiftLengthInMinutes = endTimeInMinutes-startTimeInMinutes;
    return Math.round(shiftLengthInMinutes);
  }

    let totalShiftLengthForWeek = 0
    let hoursForShift = calcShiftHours(startOfShift,endOfShift);
    totalShiftLengthForWeek += hoursForShift;
    let totalHours = Math.floor(totalShiftLengthForWeek/60);
    let totalMinutes = totalShiftLengthForWeek%60;
    return (totalHours + "h " + totalMinutes + "m");
}

export { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours,
  createDateObjFromDateString, calcShiftLenghtInHourMinFormat, convertMilitaryTimeStringToMilitaryTimeFloat,
  createDateStringFromDateObject, zeroPadNumber };
