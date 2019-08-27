// import React from 'react';
// import { calculateDailyWorkingHours } from '../../../lib/time-functions';

// class IndividualShift extends React.Component {
//   render() {
//     const range = this.props.range;
//     const data = this.props.shift;

//     const availableHours = (range.max - range.min)/100;
//     const widthPerSlot = 100 / availableHours;
//     const shiftTotalHours = calculateDailyWorkingHours(data.startTime, data.endTime);
//     const timeSlots = widthPerSlot * (shiftTotalHours);
//     const shiftWidth = timeSlots + "%";
//     const leftStartTime = (parseFloat(data.startTime) - range.min);
//     const leftStartTimeSimpleHours = leftStartTime / 100;
//     const shiftStartPosition = widthPerSlot *  leftStartTimeSimpleHours + '%';
    
  
//     // let shiftType = null;

//     // if (this.props.shift.posted === false){
//     //   shiftType = "scheduled scheduled-shift-color" 
//     // } else {
//     //   shiftType = "posted posted-shift-color";
//     // }


//     return (
//       <div
//         key={this.props.shift.round_date + data.startTime + data.endTime}
//         className={`shift ${this.props.shiftType}`}
//         style={{
//           left: shiftStartPosition,
//           width: shiftWidth
//         }}>
//           {this.props.children.map((shiftData, index) => (
//             <IndividualShift 
//               key={index} 
//               shift={shiftData} 
//               range={{min: this.props.range.min, max: this.props.range.max}} 
//               shiftType={'scheduled'}
//               children={[]}
//             />
//           ))}
//       </div>
//     );
//   }
// }

// export default IndividualShift;
