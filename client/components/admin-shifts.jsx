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
    this.fetchAutoPopulatedData = this.fetchAutoPopulatedData.bind(this);
    this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = 1566273600; 
    this.state = {
      rounds: [],
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
  }

  fetchAutoPopulatedData() {
    debugger;
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'GET'
    })
      .then(response => {
        this.dataDidUpdate();
        return response.json()
      })
      .then(myJson => {
        this.setState({
          rounds: myJson
        }),
        console.log(this.state.rounds)
      })
      // .then(res => console.log("res", res))
      .catch(error => { throw (error) });
  }

  getAvailableDrivers(){
    fetch(`/api/admin-available-drivers.php`, {
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
          rounds: myJson
        })
      })
      .catch(error => { throw (error) });
  }

  componentDidMount() {
    this.fetchCallMethod(this.state.queryString);
  }

  dataDidUpdate(){
    this.fetchCallMethod(this.state.queryString);
  }

  //build array for a specific line and busNumber and sort by start time
  buildRoundsByLine(lineName, busNumber) {
    var roundsForLine = [];
    
    for( var roundsIndex = 0; roundsIndex < this.state.rounds.length; roundsIndex++) {
      if(this.state.rounds[roundsIndex]['line_name'] === lineName && this.state.rounds[roundsIndex]['bus_number'] === busNumber) {
        roundsForLine.push(this.state.rounds[roundsIndex]);
      }
    }
    roundsForLine.sort((a, b) => {
      return a.round_start - b.round_start;
    });
    console.log('rounds for line: ', roundsForLine);
    return roundsForLine;
  }

  //build an array of shifts for specific line and bus number
  buildShiftsByLine(lineName, busNumber) {
    var shiftsForLine = [];
    var endTime = null;
    var sortedLineAndBusArray = this.buildRoundsByLine(lineName, busNumber);
    var startTime = sortedLineAndBusArray[0].round_start;
    var userId = sortedLineAndBusArray[0].user_id;
    for (var indexSortedArray = 0;  indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      if (sortedLineAndBusArray[indexSortedArray].user_id === userId) {
        continue;
      } 
      if(indexSortedArray === sortedLineAndBusArray.length - 1) {
        endTime = sortedLineAndBusArray[sortedLineAndBusArray.length - 1].round_end;
        shiftsForLine.push([startTime, endTime, userId]);
      }
        else {
        endTime = sortedLineAndBusArray[indexSortedArray - 1].round_end;
        shiftsForLine.push([startTime, endTime, userId]);
        startTime = sortedLineAndBusArray[indexSortedArray].round_start;
        userId = sortedLineAndBusArray[indexSortedArray].user_id;
      }
    }
    return shiftsForLine;
  }

  shiftsGroupedByLineAndBus() {
    // debugger;
    var busAndLineObject = {};
    var groupedShifts = [];
    // console.log(this.state.rounds);
    for (var index = 0; index < this.state.rounds.length; index++) {
        var joinedLineAndBusNumber = this.state.rounds[index].line_name + this.state.rounds[index].bus_number;
        busAndLineObject[joinedLineAndBusNumber] = [this.state.rounds[index].line_name, this.state.rounds[index].bus_number];
    }

    //remove the duplicates that still remain in the busAndLineArray

    console.log('busAndLineObject: ', busAndLineObject);
    for (var key in busAndLineObject) {
      var lineName = busAndLineObject[key][0];
      var busNumber = busAndLineObject[key][1];  
      groupedShifts.push([lineName, busNumber, this.buildShiftsByLine(lineName, busNumber)]);
    }
    console.log(groupedShifts);
    return groupedShifts;
  }

  render() {
    const groupedArray = this.shiftsGroupedByLineAndBus();
    console.log('groupedArray: ', groupedArray);
    const range = { min: 6, max: 24 };
    return (
      <div>
            {/* <div className="dropdown">
              <button onClick={this.getAvailableDrivers} className="dropbtn">Available Drivers</button>
              <div className="dropdown-content">
                  {fullName.map((index) => {
                    return (
                      <a href="#">{index}</a>
                    )
                  })}
              </div>
            </div> */}
            
        <TopMenuShift title="Admin" page='day' date={this.state.dateToPass} />
        <button onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
        <div className="viewHoursContainer">
          <HoursOfOperation />
        </div>
        <div className="adminShiftsDayView">
          {groupedArray.map((element, index) => {
            return (
              <div className="dayDataContainer">
                <div className="dayLabelContainer">
                  <div className="adminShiftsDayBusLine">
                    < RouteBusDisplay
                      key={index} 
                      bus={element[1]}  //bus number
                      route={element[0]} //line letter
                    /> 
                  </div>
                </div>
                <div className="shiftRowContainer"> */}
                  {/* this still needs to be fixed so it populates properly */}
                  < ShiftDisplayComponent
                    key={index}
                    range={range}
                    //need to change so it actually pulls from the proper fields in our db
                    shiftData={{ start: element[2][index][2], end: element[2][index][0]}}
                    children={element[2][index]}
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

