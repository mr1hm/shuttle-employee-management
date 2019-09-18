import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import ShiftDisplayComponent from './shifts/week/shift-display-component';
import { convertMilitaryTimeStringToMilitaryTimeFloat } from '../lib/time-functions';
import { library } from '@fortawesome/fontawesome-svg-core';

class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    const defaultDate = this.props.match.params.date ? createDateObjFromDateString(this.props.match.params.date).getTime() : parseInt(this.props.defaultDate);
    this.state = {
      shiftsAdmin: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
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
        start:  convertMilitaryTimeStringToMilitaryTimeFloat(data.start_time), //round start time
        end:  convertMilitaryTimeStringToMilitaryTimeFloat(data.end_time),  //round end time
      },
      type: data.status != 'unscheduled' ? 'active' : 'alertShift',
      range: {
        min: data.busStart, //bus start for day  //used to be shiftStartTime
        max: data.busEnd //bus end for day  //used to be shiftEndTime
      },
      routeLine: data.line_name + data.bus_info_id
    }));

    const allShiftInfo = this.state.shiftsAdmin.map((data) => ({
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
    console.log('allShiftInfo::', allShiftInfo);
    console.log('roundInfo::', roundInfo);
    console.log('childrenShifts::', childrenShifts);
    // debugger;

    return (
      <div>
        <TopMenuShift title="Admin" page='day' date={dateToPass} />
        <div className="viewHoursContainer">
          <HoursOfOperation />
        </div>
        <div className="adminShiftsDayView">
          {shiftsMapRender.map((data, index) => {
            return (
              <div className="dayDataContainer">
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
                  < ShiftDisplayComponent
                    key={index}
                    range={range}
                    shiftData={{ start: data[index].shiftData.start , end: data[index].shiftData.end  }}
                    children={childrenShifts[index]}
                    type={'active'}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
export default AdminShiftsDay;