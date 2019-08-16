import React from 'react';
import { calculateDailyWorkingHours } from '../../../lib/time-functions';

class IndividualShift extends React.Component {
  render() {
    const range = this.props.range;
    const availableHours = (range.max - range.min)/100;
    const widthPerSlot = 100 / availableHours;
    const shiftTotalHours = calculateDailyWorkingHours(this.props.shiftInfo.startTime, this.props.shiftInfo.endTime);
    const timeSlots = widthPerSlot * (shiftTotalHours);
    const shiftWidth = timeSlots + "%";
    const leftStartTime = (parseFloat(this.props.shiftInfo.startTime) - range.min);
    const leftStartTimeSimpleHours = leftStartTime / 100;
    const shiftStartPosition = widthPerSlot *  leftStartTimeSimpleHours + '%';


    let shiftType = null;
    if (this.props.shiftInfo.posted === false){
      shiftType = "scheduled scheduled-shift-color" 
    } else {
      shiftType = "posted posted-shift-color";
    }


    return (
      <div
        key={this.props.shiftInfo.shiftDate + this.props.shiftInfo.startTime + this.props.shiftInfo.endTime}
      className={`shift ${shiftType}`}
        style={{
          left: shiftStartPosition,
          width: shiftWidth
        }}>
      </div>
    )
  }
}

export default IndividualShift;



<div className="shiftRowContainer">
<div className="shiftRowFill">
  {this.props.dayData.shifts.map((shiftData, index) => <IndividualShift key={index} shiftInfo={shiftData} />)}
</div>
</div>