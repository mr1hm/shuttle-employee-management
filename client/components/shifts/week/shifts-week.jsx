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

  componentDidMount(){
    fetch('/api/shifts-week.php?' , {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(weekShiftInfo => {
        this.setState({
          data: weekShiftInfo
        })
      });
  }

  render() {
    if (!this.state.data){
      return null;
    }

    return (
      <div className="masterContainerIphone">
        <TopMenuShifts title="WEEK" page='week' date={this.props.date}/>
  
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
