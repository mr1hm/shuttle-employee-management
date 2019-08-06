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
    
    return time - finalConvertedDate * 86400000;
  }

  generateEndOfWeekTimestamp(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();
  
    return time + (6 - finalConvertedDate) * 86400000;
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
  
    const datePropToUse = this.props.match.params.date ? this.props.match.params.date : this.props.defaultDate;

    return (
      <div className="masterContainerIphone">
        <TopMenuShifts title="WEEK" page='week' date={datePropToUse}/>
  
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
