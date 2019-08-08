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

  generateStartOfWeekTimestamp(time) {
    const convertedDate = new Date(time);
    const numericDay = convertedDate.getDay();
    const startDay = new Date(time);
    startDay.setDate(startDay.getDate() - numericDay);
    const startOfWeek = startDay.getTime();	

    return startOfWeek;
  }

  generateEndOfWeekTimestamp(time) {
    const convertedDate = new Date(time);
    const numericDay = convertedDate.getDay();
    const endDay = new Date(time);
    endDay.setDate(endDay.getDate() + 6 - numericDay);
    const endOfWeek = endDay.getTime();	

    return endOfWeek;
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

    console.log('didMount: ', this.props.defaultDate);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.match.params.date !== this.props.match.params.date){
      const startOfTheWeek = this.generateStartOfWeekTimestamp(this.props.match.params.date);
      const endOfTheWeek = this.generateEndOfWeekTimestamp(this.props.match.params.date);
      this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + 1, 'GET');

      console.log('didUpdate: ', this.props.match.params.date);
    }
  }  

  render() {

    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
      console.log('conditional check: ', dateToPass);
    } else {
      dateToPass = createDateObjFromDateString( this.props.match.params.date );
      // dateToPass.getTime();
      dateToPass = dateToPass.getTime();
    }

    // const startOfTheWeek = this.generateStartOfWeekTimestamp(dateToPass);
    // const endOfTheWeek = this.generateEndOfWeekTimestamp(dateToPass);
    // this.getData('/api/shifts-week.php?startDate=' + startOfTheWeek + '&endDate=' + endOfTheWeek + '&id=' + 1, 'GET');

    if (!this.state.data){
      return <div>no data available</div>;
    }

    return (
        <React.Fragment>
        <TopMenuShift title="WEEK" page='week' date={dateToPass}/>
        <div className="masterContainerIphone">
          <div className="subheaderContainer">
            <div className="hourWeekContainer">
              <div className="hourWeek">Total Hours This Week: <strong>10.5 </strong></div>
            </div>
            <div className="hourPostContainer">
              <div className="hourPost"><em>(3 hours posted)</em></div>
            </div>
          </div>

          <div className="viewHoursContainer">
            <HoursOfOperation />
          </div>

        <div className="calendarContainerWeekComponent">
          {this.state.data.map(day=> {
            return (
              <ShiftsWeekDay shifts={day} defaultDay={this.props.defaultDate} date={dateToPass}/>
            )
          })}
        </div>
        </div>
        </React.Fragment>
    );
  }
}


export default ShiftsWeek;
