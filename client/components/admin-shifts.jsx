import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import ShiftDisplayComponent from './shifts/week/shift-display-component';
import { convertMilitaryTimeStringToMilitaryTimeFloat, convertUnixDateDay } from '../lib/time-functions';
import { library } from '@fortawesome/fontawesome-svg-core';

class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.fetchAutoPopulatedData = this.fetchAutoPopulatedData.bind(this);
    this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    const defaultDate = 1566100800; //1573876800; //1566273600;// this.props.match.params.date ? createDateObjFromDateString(this.props.match.params.date).getTime() : parseInt(this.props.defaultDate);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    this.state = {
      shiftsAdmin: [],
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
    // console.log('defaultDate:', defaultDate);
    // console.log('dateToPass(should be same as defaultDate:', this.state.dateToPass);
    // console.log('queryString:', this.state.queryString);
  }

  fetchAutoPopulatedData() {
    debugger;
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'GET'
    })
      .then(response => {
        console.log('*********************************response')
        this.dataDidUpdate();
        return response.json()
      })
      .then(myJson => {
        console.log('#################################### got json')
        // this.dataDidUpdate();
        this.setState({
          shiftsAdmin: myJson
        })
        // setTimeout( function(){
        //   this.fetchCallMethod();
        // }, 100 );
        
      })
      // .then(res => console.log("res", res))
      .catch(error => { throw (error) });
  }

  getAvailableDrivers(start_time){
    let date;
    if(!start_time) {
      date = this.state.queryString;
    } else {
    date = this.state.queryString + '&start_time=' + start_time
    }
    fetch(`/api/admin-available-drivers.php` + date, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        this.setState({
          availableOperators: myJson
        })
      })
      .catch(error => { throw (error) });
  }

  fetchCallMethod(query) {
    fetch(`/api/admin-day-shifts.php` + query, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        this.setState({
          shiftsAdmin: myJson
        })
      })
      .catch(error => { throw (error) });
  }

  componentDidMount() {
    this.fetchCallMethod(this.state.queryString);
    this.getAvailableDrivers();
  }

  dataDidUpdate(){
    this.fetchCallMethod(this.state.queryString);
  }

  render() {
    const range = { min: 6, max: 24 };
    const dateToPass = parseInt(this.props.defaultDate);
    const lineName = [...new Set(this.state.shiftsAdmin.map((index) => index.line_name))];
    const busNumber = [...new Set(this.state.shiftsAdmin.map((index) => index.bus_info_id))];
    const routeLineArray = lineName.reduce(function (arr, v, i) {
      return arr.concat(v + busNumber[i]);
    }, []);

    const roundInfo = this.state.shiftsAdmin
      .map((data) => ({
        shiftData: {
          start: convertMilitaryTimeStringToMilitaryTimeFloat(data.start_time), //round start time
          end: convertMilitaryTimeStringToMilitaryTimeFloat(data.end_time),  //round end time
          user_name: data.user_id,
          round_status: data.status,
          start_military_time: data.start_time,
        },
        type: data.status != 'unscheduled' ? 'active' : 'alertShift',
        range: {
          min: data.busStart, //bus start for day  //used to be shiftStartTime
          max: data.busEnd //bus end for day  //used to be shiftEndTime
        },
        routeLine: data.line_name + data.bus_info_id
      }));

    const allShiftInfo = this.state.shiftsAdmin.map((data) => ({
      user_id: data.user_id,
      route: data.bus_info_id,  // 1, 2, 3
      line: data.line_name,     // C, D, H
      routeLine: data.line_name + data.bus_info_id, // C1, D2, H3
      type: data.status, // sched, unsched, posted, swapped
      shiftData: {
        start: data.busStart, // bus start for day
        end: data.busEnd      //bus end for day
      },
      range: {
        min: range.min, //6am
        max: range.max //12am
      },
      alert: [data]
    }));

    const shiftsByRouteLine = {};
    const shiftsMapRender = [];
    const childrenByBusLine = {};
    const childrenShifts = [];

    routeLineArray.forEach(routeLine => {
      shiftsByRouteLine[routeLine] = []
    })

    allShiftInfo.forEach(shift => {
      const routeLine = shift.routeLine
      shiftsByRouteLine[routeLine].push(shift);
    })

    for (const routeLine in shiftsByRouteLine) {
      const shiftGroup = shiftsByRouteLine[routeLine]
      shiftsMapRender.push(shiftGroup)
    }

    routeLineArray.forEach(routeLine => {
      childrenByBusLine[routeLine] = []
    })

    roundInfo.forEach(shift => {
      const routeLine = shift.routeLine
      childrenByBusLine[routeLine].push(shift);
    })

    for (const routeLine in childrenByBusLine) {
      const shiftGroupChildren = childrenByBusLine[routeLine]
      childrenShifts.push(shiftGroupChildren)
    }

    // how json was set up
    //  "route": 4,
    // "line": "D",
    // "startTime": 800, ----------------------\
    // "endTime": 2400, --------------\         |
    // "shifts": [ 24,25,26,27 ],      |        |
    // "alert": [                      |        | 
    //   {"start": 1200,               |        | 
    //     "end": 1300,                |        | 
    //     "type": "alertShift",       |        | 
    //     "shiftStartTime": 800,------|-------/
    //     "shiftEndTime": 2400 ------/
    //   }
    console.log("shiftsMapRender::", shiftsMapRender);
    // console.log('allShiftInfo::', allShiftInfo);
    // console.log('roundInfo::', roundInfo);
    // console.log('childrenShifts::', childrenShifts);
    // debugger;
console.log('Available Drivers:',this.state.availableOperators)
// debugger;
// sort through id numbers instead of names to create names list
const driverIds = [...new Set(this.state.availableOperators.map((index) => index.user_id))];
// console.log('driverIDs', driverIds);

const firstName = [...new Set(this.state.availableOperators.map((index) => index.first_name))];
const lastName = [...new Set(this.state.availableOperators.map((index) => index.last_name))];
const fullName = firstName.reduce(function (arr, v, i) {
  return arr.concat(lastName[i] + ', ' + v);
}, []);
console.log('Array of available driver names:', fullName);
// console.log('Array of available first names:', firstName)
// console.log('Array of available last names:', lastName)
// debugger;
// console.log("shiftsMapRender[0][0].alert[0].start_time",shiftsMapRender[0][0].alert[0].start_time);  // gives '600'
// shiftsMapRender[0][1].alert[0].start_timev//620

    return (
      <div>            
        <TopMenuShift title="Admin" page='day' date={dateToPass} />
        <button onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
        <div className="viewHoursContainer">
          <HoursOfOperation />
        </div>
        <div className="adminShiftsDayView">
          {shiftsMapRender.map((data, index) => {
            return (
              <div key={index} className="dayDataContainer">
                <div className="dayLabelContainer">
                  <div className="adminShiftsDayBusLine">
                    < RouteBusDisplay
                      key={index}
                      bus={data[index].route}  //bus number
                      route={data[index].line} //line letter
                    />
                  </div>
                </div>
                <div className="shiftRowContainer">
                  <div className="individual-round">
                  < ShiftDisplayComponent
                    key={index}
                    range={range}
                    shiftData={{ start: data[index].shiftData.start, end: data[index].shiftData.end }}
                    children={childrenShifts[index]}
                    type={'active'}
                    onClick={this.getAvailableDrivers}
                  />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="dropdown drivers-list">
              <ul className="dropbtn">Drivers
              <li className="dropdown-content">
                  {fullName.map((name,index) => {                    
                    return (
                      <a key={index} href="#">{name}</a>
                    )
                  })}
              </li>
              </ul>
        </div>
      </div>
    )
  }
}
export default AdminShiftsDay;

// if (convertUnixDateDay(dateToPass) == data.day_of_week) {}
// <option>
// data.map(res=>console.log('response in map:',res.alert[0]))