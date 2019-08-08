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
    const saturday = time - (finalConvertedDate - 6) * 86400000; //save as object with
    // shiftDate
    //const sunday = new Date();
    // sundayObject.setDate(sundayObject.getDate() - finalConvertedDate);
    // sundayObject.setHours(0);
    // sundayObject.setMinutes(0);
    // sundayObject.setHours(0);
    var daysObject = {

    }
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
    // for(let dayBaseIndex = 0; dayBaseIndex < 7; dayBaseIndex++){
    //   sundayObject.setDate(sundayObject.getDate() + dayBaseIndex);
    //   timeArray.push(sundayObject.getTime());
    // }
    return daysObject;

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

  generateArrayOfFullWeek(weekData){
    if(this.state.data===null){
      return;
    }
    //const weekData = this.generateFullWeekOfTimestamps(dateToPass);
    /*
    [
      {
        shiftDate: 025235234,  //timestamp for this past sunday
        shifts: []
      },
      {
        shiftDate: 025235234, //timestamp for this past monday
        shifts: []
      }
    ]
    */
      //     <ShiftsWeekDay shifts={day} defaultDay={this.props.defaultDate} />
/*
thisShift:  {
	"id": "13",
	"startTime": "730",
	"endTime": "930",
	"routeInfoID": "2",
	"authorID": "2",
	"sessionID": "1",
	"ownerID": "1",
	"shiftDate": "1564297200000",
	"posted": false
}
weekData[someDay]
{shiftDate: 1564876800000
shifts: []}
*/

//at the end of the array we will have 7 objects with shifts arrays in them, some
//with shifts in them and some without
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
    if (this.props.match.params.date === undefined) {
      var dateToPass = this.props.defaultDate;
    } else {
      dateToPass = new Date(this.props.match.params.date);
      dateToPass = dateToPass.getTime();

    }
    const weekArray = this.generateFullWeekOfTimestamps(dateToPass);
    const weekDayShiftArray = this.generateArrayOfFullWeek(weekArray);
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
            {weekDayShiftArray.map(dayData => {
              return (
                <ShiftsWeekDay dayData={ dayData } +-shifts={dayData.shifts} defaultDay={this.props.defaultDate} />
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
