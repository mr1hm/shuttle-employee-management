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

        <div className="calendarContainer">
          {this.state.data.map(day=> {
            return (
              <ShiftsWeekDay shifts={day} defaultDay={this.props.defaultDate} />
            )
          })}
        </div>
        </div>
      </React.Fragment>
    );
  }
}


export default ShiftsWeek;
