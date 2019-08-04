// import React from 'react';
// import DayOfWeek from './day-of-week-component';

// class WeekOfMonth extends React.Component {
//   calculateSumOfHoursScheduledForWeek() {
//     let sumOfHours = null;
//     for (let i = 0; i < this.props.weeklyHours.length; i++) {
//       var weeklyHours = this.props.weeklyHours
//       sumOfHours += (weeklyHours[i].endTime-weeklyHours[i].startTime)/100;
//     }
//     let fullHours = Math.trunc(sumOfHours);
//     let minutes = ((sumOfHours - fullHours) * 60).toFixed(0);
//     return (
//       fullHours + 'h ' + minutes + 'm'
//     );
//   }
//   render() {
//     return (
//       <React.Fragment>
//           <div>
//             {this.props.currentWeekArray.map(date =>
//                 <DayOfWeek key={date} dataFromWeekOfMonth={date}/>
//             )}
//           </div>
//           {/* <div> */}
//             {/* {this.calculateSumOfHoursScheduledForWeek()} */}
//           {/* </div>  */}
//       </React.Fragment>
          
//     )
//   }
// }

// export default WeekOfMonth;
