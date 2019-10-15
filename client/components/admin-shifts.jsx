import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import AdminShiftsDisplayComponent from './admin-shifts-display-component';
import './admin-shifts-display.css';

class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.fetchAutoPopulatedData = this.fetchAutoPopulatedData.bind(this);
    // this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = 1566273600;
    this.state = {
      rounds: null,
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
  }

  //I don't think this approach will work.
  //The autopopulate takes awhile and it is pulling the round data too soon.
  //It's not noticing that anything has been updated, so the rounds array does not have the
  //right information.
  fetchAutoPopulatedData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
    .then(() => {
      this.fetchCallMethod();
    })
    .catch(error => { throw (error) });
  }

  // getAvailableDrivers(){
  //   fetch(`/api/admin-available-drivers.php`, {
  //     method: 'GET'
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(myJson => {
  //       this.setState({
  //         availableOperators: myJson
  //       })
  //     })
  //     .catch(error => { throw (error) });
  // }

  // fetchCallMethod(query) {
  //   fetch(`/api/admin-day-shifts.php` + query, {
  //     method: 'GET'
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(myJson => {
  //       this.setState({
  //         rounds: myJson
  //       })
  //     })
  //     .catch(error => { throw (error) });
  // }

  // get assigned rounds from admin-day-shifts.php
  fetchCallMethod() {
    fetch(`/api/admin-day-shifts.php`, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({
          rounds: data
        });
      })
      .catch(error => { throw (error) });
  }

  // componentDidMount() {
  //   this.fetchCallMethod(this.state.queryString);
  // }

  // dataDidUpdate(){
  //   this.fetchCallMethod(this.state.queryString);
  // }

  componentDidMount() {
    // this.fetchAutoPopulatedData();
    this.fetchCallMethod();
  }

  dataDidUpdate(){
    this.fetchCallMethod();
  }

  // //shutting off the query string for right now, until it is operating properly
  // componentDidMount() {
  //   this.fetchCallMethod();
  // }

  // dataDidUpdate(){
  //   // this.fetchCallMethod();
  // }


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
    // fill in rounds that are missing and cannot be assigned
    if (roundsForLine[0].round_start !== "600"){
      let nonOperationalRound = {...roundsForLine[0]};
      nonOperationalRound.first_name = "n/a";
      nonOperationalRound.last_name = "n/a";
      nonOperationalRound.round_id = "n/a";
      nonOperationalRound.status = "non-operational";
      nonOperationalRound.user_id = "n/a";
      nonOperationalRound.round_start = "600";
      nonOperationalRound.round_end = roundsForLine[0].round_start;
      roundsForLine.unshift(nonOperationalRound);
    }
    var lastRoundIndex = roundsForLine.length - 1;
    if (roundsForLine[lastRoundIndex].round_end !== "2400") {
      let nonOperationalRound = { ...roundsForLine[lastRoundIndex] };
      nonOperationalRound.first_name = "n/a";
      nonOperationalRound.last_name = "n/a";
      nonOperationalRound.round_id = "n/a";
      nonOperationalRound.status = "non-operational";
      nonOperationalRound.user_id = "n/a";
      nonOperationalRound.round_start = roundsForLine[lastRoundIndex].round_end;
      nonOperationalRound.round_end = "2400";
      roundsForLine.push(nonOperationalRound);
    }
    console.log('rounds for line: ', roundsForLine);
    return roundsForLine;
  }

  //build an array of shifts for specific line and bus number
  buildShiftsByLine(lineName, busNumber) {
    // debugger;
    var shiftsForLine = [];
    var endTime = null;
    var sortedLineAndBusArray = this.buildRoundsByLine(lineName, busNumber);
    console.log('sortedLineAndBusArray: ', sortedLineAndBusArray);
    var startTime = sortedLineAndBusArray[0].round_start;
    var userId = sortedLineAndBusArray[0].user_id;
    for (var indexSortedArray = 0;  indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      if(indexSortedArray === sortedLineAndBusArray.length - 1) {
        if (userId !== sortedLineAndBusArray[indexSortedArray].user_id){
          endTime = sortedLineAndBusArray[indexSortedArray - 1].round_end;
          shiftsForLine.push({ 'start_time': startTime, 'end_time': endTime, 'user_id': userId });
          startTime = sortedLineAndBusArray[indexSortedArray].round_start;
          userId = sortedLineAndBusArray[indexSortedArray].user_id;
        }
        endTime = sortedLineAndBusArray[indexSortedArray].round_end;
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
      } else if (sortedLineAndBusArray[indexSortedArray].user_id === userId && sortedLineAndBusArray[indexSortedArray].user_id != 1 && sortedLineAndBusArray[indexSortedArray].user_id != "n/a") {
        continue;
      } else {
        endTime = sortedLineAndBusArray[indexSortedArray].round_end;
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
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
    console.log('rounds: ', this.state.rounds);

    if (this.state.rounds) {
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
      console.log('groupedShifts: ', groupedShifts);
      var elements = [];
      var busLineElements = [];
      var shiftRowElements = [];
      var range = { min: 600, max: 2400 };
      groupedShifts.forEach((element, index) => {
        busLineElements.push(
          <div key={index} className="bus-line adminShiftRow d-flex justify-content-center">
            < RouteBusDisplay
              bus={element[1]}  //bus number
              route={element[0]} //line letter
            />
          </div>);
        shiftRowElements.push(
          <div key={index} className="shiftRowContainer adminShiftRow container w-100">
            < AdminShiftsDisplayComponent
              range={range}
              shiftData={{ start: 600, end: 2400 }}
              children={element[2]}
              type={'alertShift'}
            />
          </div>
        );
      });
      elements.push(busLineElements);
      elements.push(shiftRowElements);
      return elements;
    }
  }

  render() {
    if (!this.state.rounds) {
      return <div>Retrieving Data</div>;
    } else {
      var elements = this.shiftsGroupedByLineAndBus();
      return (
        <div>
          <TopMenuShift title="Admin" page='day' date={this.state.dateToPass} />
          <div className="main-container d-flex h-100">
            <div className="auto-populate-bus-line-container container d-flex flex-column justify-content-center col-2">
              <div className="auto-populate-button-container d-flex justify-content-center align-items-center adminShiftRow">
                <button className="btn btn-primary" onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
              </div>
              {elements[0]}
            </div>
            <div className="hours-populated-shifts-container container d-flex flex-column">
              <div className="view-hours-container d-flex align-items-end adminShiftRow">
                <HoursOfOperation />
              </div>
              {elements[1]}
            </div>
            <div className="additional-info-container container d-flex col-3 adminShiftRow">
              <div className="available-operators">available operators</div>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default AdminShiftsDay;
