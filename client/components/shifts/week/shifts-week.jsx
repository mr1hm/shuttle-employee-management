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
    const convertedDateStart = createDateObjFromDateString(time)
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
    const sunday = time - finalConvertedDate * 86400000;
    const monday = time - (finalConvertedDate -1) * 86400000;
    const tuesday = time - (finalConvertedDate - 2) * 86400000;
    const wednesday = time - (finalConvertedDate - 3) * 86400000;
    const thursday = time - (finalConvertedDate - 4) * 86400000;
    const friday = time - (finalConvertedDate - 5) * 86400000;
    const saturday = time - (finalConvertedDate - 6) * 86400000;
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
    const convertedDate = createDateObjFromDateString(time);
    const numericDay = convertedDate.getDay();
    const startDay = createDateObjFromDateString(time);
    startDay.setDate(startDay.getDate() - numericDay);
    const startOfWeek = startDay.getTime();
    return startOfWeek;
  }
  generateEndOfWeekTimestamp(time) {
    const convertedDate = createDateObjFromDateString(time);
    const numericDay = convertedDate.getDay();
    const endDay = createDateObjFromDateString(time);
    endDay.setDate(endDay.getDate() + 6 - numericDay);
    const endOfWeek = endDay.getTime();
    return endOfWeek;
  }
  generateArrayOfFullWeek(weekData){
    if(this.state.data===null){
      return;
    }
    for( let shiftI = 0; shiftI < this.state.data.length; shiftI++){
      let thisShift = this.state.data[shiftI];
      let shiftTimestamp = thisShift.shiftDate
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
        // weekShiftInfo = [{
        //   "id": "8",
        //   "startTime": "600",
        //   "endTime": "1000",
        //   "routeInfoID": "1",
        //   "authorID": "2",
        //   "sessionID": "1",
        //   "ownerID": "1",
        //   "shiftDate": "1563692400000",
        //   "posted": false
        // }]
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
    return (
        <React.Fragment>
        <TopMenuShift title="WEEK" page='week' date={dateToPass}/>
        <div className="masterContainerIphone">
          <div className="viewHoursContainer">
            <HoursOfOperation />
          </div>
          <div className="calendarContainerWeekComponent">
              {weekDayShiftArray.map((dayData, index) => {
                return (
                  <ShiftsWeekDay key={index} dayData={dayData} shifts={dayData.shifts} defaultDay={this.props.defaultDate} date={dateToPass} />
                  )
              })}
          </div>
        </div>
        </React.Fragment>
    );
  }
}

export default ShiftsWeek;
