import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';
import TopMenuShifts from '../../topmenu/topmenu-shift';


class ShiftsWeek extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  generateStartOfWeekTimestamp(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
  
    switch(finalConvertedDate){
      case 0: 
        return time;
      case 1: 
        return time - 86400000;
      case 2: 
        return time - (finalConvertedDate * 86400000);
      case 3: 
        return time - (finalConvertedDate * 86400000);
      case 4: 
        return time - (finalConvertedDate * 86400000);
      case 5: 
        return time - (finalConvertedDate * 86400000);
      case 6: 
        return time - (finalConvertedDate * 86400000);
    }
  }

  generateEndOfWeekTimestamp(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
  
    switch(finalConvertedDate){
      case 0: 
        return time + (6 * 86400000);
      case 1: 
        return time + (5 * 86400000);
      case 2: 
        return time + (4 * 86400000);
      case 3: 
        return time + (3 * 86400000);
      case 4: 
        return time + (2 * 86400000);
      case 5: 
        return time + 86400000;
      case 6: 
        return time;
    }
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

  render() {
    if (!this.state.data){
      return null;
    }

    if (this.props.match.params.date === undefined) {
      this.props.match.params.date = this.props.defaultDate;
    } 
  
    return (
      <div className="masterContainerIphone">
        <TopMenuShifts title="WEEK" page='week' date={this.props.match.params.date}/>
  
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
              <ShiftsWeekDay shifts={day} />
            )
          })}
        </div>

      </div>
    );
  };
}

export default ShiftsWeek;
