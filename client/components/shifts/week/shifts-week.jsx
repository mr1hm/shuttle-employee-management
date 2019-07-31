import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';

class ShiftsWeek extends React.Component {
  render() {
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
          {Object.keys(scheduleDummyData.week).sort().map(day=> {
            return (
              <ShiftsWeekDay shifts={scheduleDummyData.week[day]} />
            )
          })}
        </div>

      </div>
    );
  };
}
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
        "restricted": false,
        "clickCallback": () => { console.log('click') }
      }],
    "1": [{
      "startTime": "0800",
      "endTime": "1115",
      "date": 1563778800000,
      "posted": false,
      "restricted": true,
      "clickCallback": () => { console.log('click') }
    }],
    "2": [{
      "startTime": "1500",
      "endTime": "2045",
      "date": 1563865200000,
      "posted": false,
      "restricted": false,
      "clickCallback": () => { console.log('click') }
    },
    {
      "startTime": "2100",
      "endTime": "2300",
      "date": 1563865200000,
      "posted": true,
      "restricted": false,
      "clickCallback": () => { console.log('click') }
    },
    {
      "startTime": "0700",
      "endTime": "1200",
      "date": 1563865200000,
      "posted": true,
      "restricted": true,
      "clickCallback": () => { console.log('click') }
<<<<<<< HEAD
    }],
    "3": [{
      "startTime": "0800",
      "endTime": "1115",
      "date": 1563951600000,
      "posted": false,
      "restricted": true,
      "clickCallback": () => { console.log('click') }
    },
      {
        "startTime": "1400",
        "endTime": "1900",
        "date": 1563951600000,
        "posted": false,
        "restricted": true,
        "clickCallback": () => { console.log('click') }
      }
    ],
    "4": [
      { "startTime": "0000",
        "endTime": "0000",
        "date": 1564038000000,
        "clickCallback": () => { console.log('click')}
    }
    ],
    "5": [
      {
        "startTime": "0000",
        "endTime": "0000",
        "date": 1564124400000,
        "clickCallback": () => { console.log('click') }
      }
    ],
    "6": [
      {
        "startTime": "0000",
        "endTime": "0000",
        "date": 1564210800000,
        "clickCallback": () => { console.log('click') }
      }
    ]
=======
    }]

>>>>>>> 043af59086ad64f6d51d100f72135818f69df0ab
  }
}

export default ShiftsWeek;
