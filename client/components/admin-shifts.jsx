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
    this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
    this.handleClickSelectShifts = this.handleClickSelectShifts.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    const defaultDate = 1566619200;
    this.state = {
      rounds: null,
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate,
      roundsSelected: [],
      roundTimes: [],
      selecting: false
    }
  }
  //updating the db with the autopopulated rounds
  fetchAutoPopulatedData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
    .then(() => {
      this.fetchCallMethod();
    })
    .catch(error => { throw (error) });
  }

  // get assigned rounds from admin-day-shifts.php
  fetchCallMethod() {
    fetch(`/api/admin-day-shifts.php`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          rounds: data
        });
        // console.log(data);
      })
      .catch(error => { throw (error) });
  }
  getAvailableDrivers(startTime, endTime, roundId, userId){
    if (!this.state.selecting || userId != 1) {
      return;
    }
    var roundsSelected = this.state.roundsSelected;
    var roundTimes = this.state.roundTimes;
    roundsSelected.push(roundId);
    roundTimes.push({
      "start_time": startTime,
      "stop_time": endTime
    })
    var roundTimes = JSON.stringify(this.state.roundTimes);
    fetch(`/api/admin-available-operators.php?date=1566619200&round_time=${roundTimes}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          availableOperators: data,
          roundsSelected: roundsSelected
        });
      })
      .catch(error => { throw (error) });
  }
  groupOperatorsByUserId(operatorsList){
    var groupedOperators = {};
    for (var operatorsListIndex = 0; operatorsListIndex < operatorsList.length; operatorsListIndex++){
      var operatorId = operatorsList[operatorsListIndex].id;
      if(!groupedOperators[operatorId]){
        groupedOperators[operatorId] = [];
      }
      groupedOperators[operatorId].push(operatorsList[operatorsListIndex]);
    }
    return groupedOperators;
  }
  createAvailableOperatorElements(){
    const availableOperatorsElements = this.state.availableOperators.map( operator => {
      return(
          <div
            key={operator.id}
            id={operator.id}
            className="availableOperator rounded border d-flex justify-content-center align-items-center"
            onClick={this.handleClickAssignShift}>
            {`${operator.lastName}, ${operator.firstName}`}
          </div>
      );
    });
    if (availableOperatorsElements.length){
      return (
        <React.Fragment>
          <div className="available-operators">Available Operators</div>
          {availableOperatorsElements}
        </React.Fragment>
      );
    }
  }
  handleClickAssignShift(event){
    console.log(event.target.id, this.state.roundsSelected);
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': event.target.id,
        'rounds': this.state.roundsSelected
      }),
      headers: { 'Content-Type': 'application/json' }
    }
    fetch(`/api/admin-update-shifts.php`, data)
      .then(response => {})
      .then(data => {
        this.fetchCallMethod();
        this.setState({
          availableOperators: [],
          roundsSelected: []
        });
      })
      .catch(error => {throw(error)});
  }
  componentDidMount() {
    this.fetchCallMethod();
  }
  dataDidUpdate(){
    this.fetchCallMethod();
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
    return roundsForLine;
  }

  //build an array of shifts for specific line and bus number
  buildShiftsByLine(lineName, busNumber) {
    var shiftsForLine = [];
    var sortedLineAndBusArray = this.buildRoundsByLine(lineName, busNumber);
    var previousUserId = null;
    let roundCounter = 0;
    for (var indexSortedArray = 0;  indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      let currentUserId = sortedLineAndBusArray[indexSortedArray].user_id;
      const firstName = sortedLineAndBusArray[indexSortedArray].first_name;
      const lastName = sortedLineAndBusArray[indexSortedArray].last_name;
      let displayName = (firstName && lastName) ? lastName + ", " + firstName : "n/a";
      if (currentUserId == 1 || currentUserId === "n/a" || currentUserId !== previousUserId){
        roundCounter = 0;
        shiftsForLine.push({
          'start_time': sortedLineAndBusArray[indexSortedArray].round_start,
          'end_time': sortedLineAndBusArray[indexSortedArray].round_end,
          'user_id': sortedLineAndBusArray[indexSortedArray].user_id,
          'user_name': displayName,
          'rounds': roundCounter+1,
          'round_id': sortedLineAndBusArray[indexSortedArray].round_id
        });
        roundCounter = 0;
      } else {
        ++roundCounter;
        shiftsForLine[shiftsForLine.length - 1].end_time = sortedLineAndBusArray[indexSortedArray].round_end;
        shiftsForLine[shiftsForLine.length - 1].rounds = roundCounter+1;
      }
      previousUserId = currentUserId;
    }
    return shiftsForLine;
  }

  shiftsGroupedByLineAndBus() {
    var busAndLineObject = {};
    var groupedShifts = [];

    if (this.state.rounds) {
      for (var index = 0; index < this.state.rounds.length; index++) {
          var joinedLineAndBusNumber = this.state.rounds[index].line_name + this.state.rounds[index].bus_number;
          busAndLineObject[joinedLineAndBusNumber] = [this.state.rounds[index].line_name, this.state.rounds[index].bus_number];
      }
      //remove the duplicates that still remain in the busAndLineArray
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
          <div key={index} className="shiftRowContainer adminShiftRow w-100">
            < AdminShiftsDisplayComponent
              onClickAvailableDrivers={this.getAvailableDrivers}
              range={range}
              shiftData={{ start: 600, end: 2400 }}
              children={element[2]}
              type={'alertShift'}
              selecting={this.state.selecting}
            />
          </div>
        );
      });
      elements.push(busLineElements);
      elements.push(shiftRowElements);
      return elements;
    }
  }
  handleClickSelectShifts(){
    this.setState({ selecting: true });
  }
  handleClickCancel(){
    this.setState({
      selecting: false,
      availableOperators: [],
      roundsSelected: [],
      roundTimes: []
    });
  }
  showCancelButton(){
    if(this.state.selecting){
      return <button className="cancelButton btn btn-secondary" onClick={this.handleClickCancel}>Cancel</button>
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
            <div className="auto-populate-bus-line-container container d-flex flex-column justify-content-center col-1 p-0 mx-2">
              <div className="auto-populate-button-container d-flex justify-content-center align-items-center adminShiftRow">
                <button className="btn btn-primary" onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
              </div>
              {elements[0]}
            </div>
            <div className="hours-populated-shifts-container container d-flex flex-column col-9 mx-2">
              <div className="view-hours-container d-flex align-items-end adminShiftRow">
                <HoursOfOperation />
              </div>
              {elements[1]}
            </div>
            <div className="additional-info-container container d-flex flex-column col-2 adminShiftRow">
              {this.createAvailableOperatorElements()}
            </div>
          </div>
          <div className="selectShiftsButtonContainer">
            <button className="selectShiftsButton btn btn-primary" onClick={this.handleClickSelectShifts}>Select Shifts to Assign</button>
            {this.showCancelButton()}
          </div>
        </div>
      )
    }
  }
}
export default AdminShiftsDay;
