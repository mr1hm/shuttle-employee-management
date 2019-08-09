import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';
import TopMenuShift from '../../topmenu/topmenu-shift';
import {createDateObjFromDateString} from '../../../lib/time-functions';

class ShiftsWeek extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  generateFullWeekOfTimestamps(time) {
    const convertedDateStart = createDateObjFromDateString(time)//new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();


    const sunday = time - finalConvertedDate * 86400000;
    const monday = time - (finalConvertedDate -1) * 86400000;
    const tuesday = time - (finalConvertedDate - 2) * 86400000;
    const wednesday = time - (finalConvertedDate - 3) * 86400000;
    const thursday = time - (finalConvertedDate - 4) * 86400000;
    const friday = time - (finalConvertedDate - 5) * 86400000;
    const saturday = time - (finalConvertedDate - 6) * 86400000;

    //create object with these shiftDates
    var daysObject = { };
    function addDayObject( timestamp ){
      daysObject[timestamp] = {
        shiftDate: timestamp,
        shifts: []
      }
    }
    const timeArray = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    timeArray.map( shiftDate => {
      addDayObject( shiftDate );
    })
    return daysObject;

  }

  generateStartOfWeekTimestamp(time) {
    const convertedDate = createDateObjFromDateString(time);//new Date(time);
    const numericDay = convertedDate.getDay();
    const startDay = createDateObjFromDateString(time);//new Date(time);
    startDay.setDate(startDay.getDate() - numericDay);
    const startOfWeek = startDay.getTime();

    return startOfWeek;
  }

  generateEndOfWeekTimestamp(time) {
    const convertedDate = createDateObjFromDateString(time);//new Date(time);
    const numericDay = convertedDate.getDay();
    const endDay = createDateObjFromDateString(time);//new Date(time);
    endDay.setDate(endDay.getDate() + 6 - numericDay);
    const endOfWeek = endDay.getTime();

    return endOfWeek;
  }

  generateArrayOfFullWeek(weekData){
    if(this.state.data===null){
      return;
    }

//at the end of the array we will have 7 objects with shifts arrays in them, some
//with shifts in them and some without
    for( let shiftI = 0; shiftI < this.state.data.length; shiftI++){
      let thisShift = this.state.data[shiftI];
      let shiftTimestamp = thisShift.shiftDate
      if (shiftTimestamp ==1565395200000){
        debugger;
      }
      if( weekData[ shiftTimestamp] !== undefined ){
        weekData[ shiftTimestamp].shifts.push( thisShift );
      }
    }
    let weekDataArray = Object.values(weekData);
    return weekDataArray;

  }

  getData(url, methodToUse) {
    fetch(url, { method: methodToUse })
      .then(response => { return response.json() })
      .then(weekShiftInfo => {
        this.setState({
          data: weekShiftInfo
        })
      })
  }

  componentDidMount(){
    const startOfTheWeek = this.generateStartOfWeekTimestamp(this.props.defaultDate);
    const endOfTheWeek = this.generateEndOfWeekTimestamp(this.props.defaultDate);
    this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + 1, 'GET');
  }

  componentDidUpdate(prevProps) {
    if(prevProps.match.params.date !== this.props.match.params.date){
      const startOfTheWeek = this.generateStartOfWeekTimestamp(this.props.match.params.date);
      const endOfTheWeek = this.generateEndOfWeekTimestamp(this.props.match.params.date);
      this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + 1, 'GET');
    }
  }

  render() {
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = createDateObjFromDateString( this.props.match.params.date );
      dateToPass = dateToPass.getTime();
    }
    const weekArray = this.generateFullWeekOfTimestamps(dateToPass);
    const weekDayShiftArray = this.generateArrayOfFullWeek(weekArray);
    if (!this.state.data){
      return <div>no data available</div>;
    }
debugger;
    return (
        <React.Fragment>
        <TopMenuShift title="WEEK" page='week' date={dateToPass}/>
        <div className="masterContainerIphone">
          {/* <div className="subheaderContainer">
            <div className="hourWeekContainer">
              <div className="hourWeek">Total Hours This Week: <strong>10.5 </strong></div>
            </div>
            <div className="hourPostContainer">
              <div className="hourPost"><em>(3 hours posted)</em></div>
            </div>
          </div> */}

          <div className="viewHoursContainer">
            <HoursOfOperation />
          </div>

        <div className="calendarContainerWeekComponent">
            {weekDayShiftArray.map(dayData => {
              return (
                <ShiftsWeekDay dayData={dayData} shifts={dayData.shifts} defaultDay={this.props.defaultDate} date={dateToPass} />
                )
            })}
        </div>
        </div>
        </React.Fragment>
    );
  }
}

export default ShiftsWeek;
