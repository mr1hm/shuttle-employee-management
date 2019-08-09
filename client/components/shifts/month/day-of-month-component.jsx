import React from 'react';
import './shifts-month.css'
import {createDateObjFromDateString} from '../../../lib/time-functions';

class DayOfMonth extends React.Component {
  
renderDate(){

  if(this.props.shiftsArray.length !== 0){
    let dayTypeClasses = {
      posted: false,
      scheduled: false
    }
    for(var shiftIndex=0; shiftIndex<this.props.shiftsArray.length; shiftIndex++){
      let baseDate = createDateObjFromDateString(parseInt(this.props.shiftsArray[shiftIndex].shiftDate));
      debugger;
      if( baseDate.getTime() === this.props.dayObj.getTime()){
      //if(new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate() === this.props.dayIndex){
        dayTypeClasses[this.props.shiftsArray[shiftIndex].status]=true;
      }
    }   
    let postedClasses = 'calendarDay';
    for( let key in dayTypeClasses){
      postedClasses += dayTypeClasses[key] ? ` ${key}-shift-color` : ''
    }
    return (
      <div class={ postedClasses}>
        {this.props.dayIndex}
      </div>
    )   
  }
  
  return (
    <div>
      <div class="calendarDay">
        {this.props.dayIndex}
      </div>
    </div> 
    );
}

render() {
    return ( 
      <div>
        {this.renderDate()}
      </div>
    );
  } 
}


export default DayOfMonth;