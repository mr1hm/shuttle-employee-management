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
        console.log("res:", response)
        return response.json()
      })
      .then(myJson => {
        console.log('myjson: ', myJson);
        this.setState({
          data: myJson
        })
      });
  }

  render() {
    if (!this.state.data){
      return null;
    }

    return (
      <div className="masterContainerIphone">
        {/* <div className="headerContainer">
          <div className="pageTitleContainer headerElement">
            <div className="pageTitle">My Shifts - Week</div>
          </div>
          <div className="weekSelectionContainer headerElement">
            <div className="weekSelector weekDropDown weekDropDownLeft"></div>
            <div className="weekSelection">July 21 - July 27</div>
            <div className="weekSelector weekDropDown weekDropDownRight"></div>
          </div>

        </div> */}
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

/*
const scheduleDummyData = {
  "startDate": 1563692400000,
  "endDate": 1564210800000,
  "userID": 60,
  "userScheduleShiftID": 308,
  "scheduleID": 8,
  "week": {
    "0": [
      {
        "startTime": "1230",
        "endTime": "1500",
        "date": 1563704640000,
        "posted": false,
        "restricted": false
      }],
    "1": [{
      "startTime": "0800",
      "endTime": "1115",
      "date": 1563778800000,
      "posted": false,
      "restricted": true
    }],
    "2": [{
      "startTime": "1500",
      "endTime": "2045",
      "date": 1563865200000,
      "posted": false,
      "restricted": false
    },
    {
      "startTime": "2100",
      "endTime": "2300",
      "date": 1563865200000,
      "posted": true,
      "restricted": false
    },
    {
      "startTime": "0700",
      "endTime": "1200",
      "date": 1563865200000,
      "posted": true,
      "restricted": true
    }]
  }
}
*/

export default ShiftsWeek;
