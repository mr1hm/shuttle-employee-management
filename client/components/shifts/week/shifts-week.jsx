import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';

class ShiftsWeek extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  componentDidMount(){
    fetch(`/api/dummy-data/dummy-data-shifts-week.json`, {
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
        <div className="headerContainer">
          <div className="pageTitleContainer headerElement">
            <div className="pageTitle">My Shifts - Week</div>
          </div>
          <div className="weekSelectionContainer headerElement">
            <div className="weekSelector weekDropDown weekDropDownLeft"></div>
            <div className="weekSelection">July 21 - July 27</div>
            <div className="weekSelector weekDropDown weekDropDownRight"></div>
          </div>

        </div>
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
          {this.state.data.week.map(day=> {
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
