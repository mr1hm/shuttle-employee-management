import React from 'react';
import './shifts-week.css';
import HoursOfOperation from './hours-of-operation';
import ShiftsWeekDay from './shifts-week-day';
import TopMenuShift from '../../topmenu/topmenu-shift';


class ShiftsWeek extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }

  generateFullWeekOfTimestamps(time) {
    const convertedDateStart = new Date(time);
    const convertedDate = new Date(convertedDateStart);
    const finalConvertedDate = convertedDate.getUTCDay();


    const sunday = time - finalConvertedDate * 86400000;
    const monday = time - (finalConvertedDate -1) * 86400000;
    const tuesday = time - (finalConvertedDate - 2) * 86400000;
    const wednesday = time - (finalConvertedDate - 3) * 86400000;
    const thursday = time - (finalConvertedDate - 4) * 86400000;
    const friday = time - (finalConvertedDate - 5) * 86400000;
    const saturday = time - (finalConvertedDate - 6) * 86400000;
    //const sunday = new Date();
    // sundayObject.setDate(sundayObject.getDate() - finalConvertedDate);
    // sundayObject.setHours(0);
    // sundayObject.setMinutes(0);
    // sundayObject.setHours(0);

    const timeArray = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
    // for(let dayBaseIndex = 0; dayBaseIndex < 7; dayBaseIndex++){
    //   sundayObject.setDate(sundayObject.getDate() + dayBaseIndex);
    //   timeArray.push(sundayObject.getTime());
    // }
    return timeArray;

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
    debugger;
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = new Date(this.props.match.params.date);
      dateToPass = dateToPass.getTime();

    }

    const weekArray = this.generateFullWeekOfTimestamps(dateToPass);

    if (!this.state.data){
      return null;
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
            { weekArray.map(day => {
              return (
                <ShiftsWeekDay shifts={day} defaultDay={this.props.defaultDate} />
                )
            })}
          {/* {this.state.data.map(day=> {
            return (
              <ShiftsWeekDay shifts={day} defaultDay={this.props.defaultDate} />
            )
          })} */}
        </div>
        </div>
      </React.Fragment>
    );
    };
  }


export default ShiftsWeek;
