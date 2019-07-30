import React from 'react';
import {
  convertUnixTime, convertUnixDateDay, convertUnixDateNumber, getShiftStartHour,
  getShiftStartMinute, getShiftEndHour, getShiftEndMinute, calculateDailyWorkingHours
} from './time-functions';

class IndividualShift extends React.Component {
/*
{
        "startTime": "1230",
        "endTime": "1500",
        "date": 1563704640000,
        "posted": false,
        "restricted": false,
        "clickCallback": () => { console.log('click') }
      }
*/

  render() {

                    return    this.props.shiftInfo.map(singleShiftObject => {
                          const range = { min: 600, max: 2400 };
                          debugger;
                          const availableHours = (range.max - range.min)/100;
                          const widthPerSlot = 100 / availableHours;
                          //calculate width per time slot

                          const shiftTotalHours = calculateDailyWorkingHours(singleShiftObject.startTime, singleShiftObject.endTime);
                          //returns total hours
                          const timeSlots = widthPerSlot * (shiftTotalHours);
                          const shiftWidth = timeSlots + "%";
                          //gives us the width of the shift box
                          const leftStartTime = (parseFloat(singleShiftObject.startTime) - range.min);
                          const leftStartTimeSimpleHours = leftStartTime / 100;
                          const shiftStartPosition = widthPerSlot *  leftStartTimeSimpleHours + '%';
                          //gives us the left percentage
                          let shiftType = null;
                          if (singleShiftObject.posted === false){
                            shiftType = "scheduled"
                          } else {
                            shiftType = "posted";
                          }

                          return (
                            <div
                            key= {singleShiftObject.date + singleShiftObject.startTime + singleShiftObject.endTime}
                            className={`shift ${shiftType}`}
                              style={{
                                left: shiftStartPosition,
                                width: shiftWidth
                              }}>

                            </div>)
                        }
                      )


                      }

}
export default IndividualShift;
