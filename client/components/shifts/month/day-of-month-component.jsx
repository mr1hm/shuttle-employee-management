import React from 'react';
import './shifts-month.css'
import {createDateObjFromDateString, convertSecondsToMilliseconds} from '../../../lib/time-functions';

class DayOfMonth extends React.Component {
  renderDate(){
    if(this.props.shiftsArray.length !== 0){
      let dayTypeClasses = {
        posted: false,
        scheduled: false
      }
      for(var shiftIndex=0; shiftIndex<this.props.shiftsArray.length; shiftIndex++){
        const shiftDate = this.props.shiftsArray[shiftIndex].date;
        const shiftDateFullTimestamp = convertSecondsToMilliseconds(shiftDate);
        let baseDate = createDateObjFromDateString(parseInt(shiftDateFullTimestamp));// converts unix time to date/at midnight 09/17/2019
        if( baseDate.getTime() === this.props.dayObj.getTime()){
          dayTypeClasses[this.props.shiftsArray[shiftIndex].status]=true;
        }
      }
      let postedClasses = 'calendarDay';
      for( let key in dayTypeClasses){
        postedClasses += dayTypeClasses[key] ? ` ${key}-shift-color` : ''
      }
      return (
        <div className={ postedClasses}>
          {this.props.dayIndex}
        </div>
      )
    }
    return (
      <div>
        <div className="calendarDay">
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
