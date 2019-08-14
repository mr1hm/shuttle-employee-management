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

export { convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours, getTotalDayWorkingHours };
