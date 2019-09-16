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

    // how json was set up
    //  "route": 4,
    // "line": "D",
    // "startTime": 800,
    // "endTime": 2400,
    // "shifts": [ 24,25,26,27 ],
    // "alert": [
    //   {"start": 1200,
    //     "end": 1300,
    //     "type": "alertShift",
    //     "shiftStartTime": 800,
    //     "shiftEndTime": 2400
    //   }
    const lineName = [...new Set(this.state.shiftsAdmin.map((index) => index.line_name))];
    const busNumber = [...new Set(this.state.shiftsAdmin.map((index) => index.bus_info_id))];
    const routeLineArray = lineName.reduce(function (arr, v, i) {
      return arr.concat(v + busNumber[i]);
    }, []);

    const roundInfo = this.state.shiftsAdmin
      .map((data) => ({ // FILTER?
        start: data.start_time,
        end: data.end_time,
        type: data.status != 'unscheduled' ? 'active' : 'alertShift',
        shiftStartTime: data.busStart,
        shiftEndTime: data.busEnd
      }))

    const allShiftInfo = this.state.shiftsAdmin.map((data) => ({
      route: data.bus_info_id,
      line: data.line_name,
      routeLine: data.line_name + data.bus_info_id,
      startTime: data.busStart,
      endTime: data.busEnd,
      start: data.start_time,
      end: data.end_time,
      type: data.status != 'unscheduled' ? 'active' : 'alertShift',
      shiftStartTime: data.busStart,
      shiftEndTime: data.busEnd,
      alert: [data]
    }));


    // {
    //   C1: [],
    //   D2: [],
    //   // etc
    // }
    // You could create this structure by looping through your array of routeLines

    // // assume routeLines array is ['C1', 'D2', etc]
    // const shiftsByRouteLine = {}


    // routeLines.forEach(routeLine => {
    //   shiftsByRouteLine[routeLine] = []
    // })

    // allShiftInfo.forEach(shift => {
    //   const routeLine = shift.routeLine
    //   shiftsByRouteLine[routeLine].push(shift)
    // })


    // If the shiftsByRouteLine has a key for each routeLine set to an empty array, you can push each shift into the matching array.
    // That will at least group them.


    // If you need an array of arrays, you can then take the grouped shifts and loop through the keys, pushing each group array into the final array.
    // const shifts = []
    // for (const routeLine in shiftsByRouteLine) {
    //   const shiftGroup = shiftsByRouteLine[routeLine]
    //   shifts.push(shiftGroup)
    // }

    const shiftsByRouteLine = {};

    routeLineArray.forEach(routeLine => {
      shiftsByRouteLine[routeLine] = []
    })

    allShiftInfo.forEach(shift => {
      const routeLine = shift.routeLine
      shiftsByRouteLine[routeLine].push(shift);
    })

    const shifts = []
    for (const routeLine in shiftsByRouteLine) {
      const shiftGroup = shiftsByRouteLine[routeLine]
      shifts.push(shiftGroup)
    }

    console.log("shifts:", shifts);
    console.log("shiftsByRouteLine:", shiftsByRouteLine);
    console.log('routeLineArray:', routeLineArray);
    console.log('allShiftInfo:', allShiftInfo);
    console.log('roundInfo:', roundInfo);
    // debugger;
    return (
      <div>
        <TopMenuShift title="Admin" page='day' date={dateToPass} />
        <div className="viewHoursContainer">
          <HoursOfOperation />
        </div>
        <div className="adminShiftsDayView">
          {shifts.map((data,index) => {
            return (
              <div className="dayDataContainer">
                <div className="dayLabelContainer">
                  <div className="adminShiftsDayBusLine">
                    < RouteBusDisplay
                      key={index}
                      bus={data.route}  //bus number
                      route={data.line} //line letter
                    />
                  </div>
                </div>
                <div className="shiftRowContainer">
                  < ShiftDisplayComponent
                    key={index}
                    range={range}
                    shiftData={{ start: data.startTime / 100, end: data.endTime / 100 }}
                    children={data}
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


//from shifts-week::::
// {/* <ShiftDisplayComponent
// test='1'
// type='active'
// range={range}
// shiftData={startAndEndTimes}
// children={convertedShifts}
// /> */}
