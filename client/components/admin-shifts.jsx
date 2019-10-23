import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import AdminClickedShiftDetailsAside from './admin-shifts-clicked-details-aside';
import AdminShiftsCombinedRounds from './admin-shifts-combined-rounds';
import './admin-shifts-display.css';
import AdminAvailableOperatorsDisplay from './admin-available-operators-display';
class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.handleShiftClick = this.handleShiftClick.bind(this);
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.fetchAutoPopulatedData = this.fetchAutoPopulatedData.bind(this);
    this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
    this.handleClickAssignShifts = this.handleClickAssignShifts.bind(this);
    this.handleClickUnassignShifts = this.handleClickUnassignShifts.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
    const defaultDate = 1566619200;
    this.state = {
      rounds: null,
      availableOperators: [],
      shiftsSelected: [],
      dateToPass: defaultDate,
      roundsSelected: [],
      roundTimes: [],
      selectingAssign: false,
      selectingUnassign: false,
      groupedShifts: []
    };
  }
  // updating the db with the autopopulated rounds
  fetchAutoPopulatedData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
      .then(() => {
        this.fetchCallMethod();
      })
      .catch(error => { throw (error); });
  }
  // get assigned rounds from admin-day-shifts.php
  fetchCallMethod() {
    fetch(`/api/admin-day-shifts.php`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          groupedShifts: data
        });
      })
      .catch(error => { throw (error); });
  }
  getAvailableDrivers(startTime, endTime, roundId, userId) {
    if (!this.state.selectingAssign || userId !== 1) {
      return;
    }
    var roundsSelected = this.state.roundsSelected;
    var roundTimes = this.state.roundTimes;
    var roundIndex = roundsSelected.indexOf(roundId);
    if (roundIndex >= 0) {
      roundTimes.splice(roundIndex, 1);
      roundsSelected.splice(roundIndex, 1);
    } else {
      roundsSelected.push(roundId);
      roundTimes.push({
        'start_time': startTime,
        'stop_time': endTime
      });
    }
    console.log(roundTimes, roundsSelected, roundIndex);
    if (roundTimes.length === 0) {
      this.setState({
        roundsSelected: [],
        roundTimes: [],
        availableOperators: []
      });
      return;
    }
    var roundTimesString = JSON.stringify(this.state.roundTimes);
    fetch(`/api/admin-available-operators.php?date=1566619200&round_time=${roundTimesString}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          availableOperators: data,
          roundsSelected: roundsSelected,
          roundTimes: roundTimes
        });
      })
      .catch(error => { throw (error); });
  }
  groupOperatorsByUserId(operatorsList) {
    var groupedOperators = {};
    for (var operatorsListIndex = 0; operatorsListIndex < operatorsList.length; operatorsListIndex++) {
      var operatorId = operatorsList[operatorsListIndex].id;
      if (!groupedOperators[operatorId]) {
        groupedOperators[operatorId] = [];
      }
      groupedOperators[operatorId].push(operatorsList[operatorsListIndex]);
    }
    return groupedOperators;
  }
  handleClickAssignShift(event) {
    console.log(event.target.id, this.state.roundsSelected);
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': event.target.id,
        'rounds': this.state.roundsSelected
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-update-shifts.php`, data)
      .then(response => { })
      .then(data => {
        this.fetchCallMethod();
        this.setState({
          availableOperators: [],
          roundsSelected: [],
          selectingAssign: false,
          shiftsSelected: []
        });
      })
      .catch(error => { throw (error); });
  }
  componentDidMount() {
    this.fetchCallMethod();
  }
  dataDidUpdate() {
    this.fetchCallMethod();
  }
  // build array for a specific line and busNumber and sort by start time
  buildRoundsByLine(data, lineName, busNumber) {
    var roundsForLine = [];
    for (var roundsIndex = 0; roundsIndex < data.length; roundsIndex++) {
      if (data[roundsIndex]['line_name'] === lineName && data[roundsIndex]['bus_number'] === busNumber) {
        roundsForLine.push(data[roundsIndex]);
      }
    }
    roundsForLine.sort((a, b) => {
      return a.round_start - b.round_start;
    });
    // fill in rounds that are missing and cannot be assigned
    if (roundsForLine[0].round_start !== '600') {
      let nonOperationalRound = { ...roundsForLine[0] };
      nonOperationalRound.first_name = 'n/a';
      nonOperationalRound.last_name = 'n/a';
      nonOperationalRound.round_id = 'n/a';
      nonOperationalRound.status = 'non-operational';
      nonOperationalRound.user_id = 'n/a';
      nonOperationalRound.round_start = '600';
      nonOperationalRound.round_end = roundsForLine[0].round_start;
      roundsForLine.unshift(nonOperationalRound);
    }
    var lastRoundIndex = roundsForLine.length - 1;
    if (roundsForLine[lastRoundIndex].round_end !== '2400') {
      let nonOperationalRound = { ...roundsForLine[lastRoundIndex] };
      nonOperationalRound.first_name = 'n/a';
      nonOperationalRound.last_name = 'n/a';
      nonOperationalRound.round_id = 'n/a';
      nonOperationalRound.status = 'non-operational';
      nonOperationalRound.user_id = 'n/a';
      nonOperationalRound.round_start = roundsForLine[lastRoundIndex].round_end;
      nonOperationalRound.round_end = '2400';
      roundsForLine.push(nonOperationalRound);
    }
    return roundsForLine;
  }

  // build an array of shifts for specific line and bus number
  buildShiftsByLine(data, lineName, busNumber) {
    var shiftsForLine = [];
    var sortedLineAndBusArray = this.buildRoundsByLine(data, lineName, busNumber);
    var previousUserId = null;
    for (var indexSortedArray = 0; indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      let currentUserId = sortedLineAndBusArray[indexSortedArray].user_id;
      const firstName = sortedLineAndBusArray[indexSortedArray].first_name;
      const lastName = sortedLineAndBusArray[indexSortedArray].last_name;
      if (currentUserId == 1 || currentUserId === 'n/a' || currentUserId !== previousUserId) { //
        shiftsForLine.push({
          'round_id': sortedLineAndBusArray[indexSortedArray].round_id,
          'line_name': lineName + busNumber,
          'start_time': sortedLineAndBusArray[indexSortedArray].round_start,
          'end_time': sortedLineAndBusArray[indexSortedArray].round_end,
          'user_id': sortedLineAndBusArray[indexSortedArray].user_id,
          'user_name': {
            'first': firstName || 'n/a',
            'last': lastName || 'n/a'
          },
          'rounds': [{
            'id': sortedLineAndBusArray[indexSortedArray].round_id,
            'start': sortedLineAndBusArray[indexSortedArray].round_start,
            'end': sortedLineAndBusArray[indexSortedArray].round_end
          }]
        });
      } else {
        shiftsForLine[shiftsForLine.length - 1].end_time = sortedLineAndBusArray[indexSortedArray].round_end;
        shiftsForLine[shiftsForLine.length - 1].rounds.push({
          'id': sortedLineAndBusArray[indexSortedArray].round_id,
          'start': sortedLineAndBusArray[indexSortedArray].round_start,
          'end': sortedLineAndBusArray[indexSortedArray].round_end
        });
      }
      previousUserId = currentUserId;
    }
    return shiftsForLine;
  }
  // group operatorStats by id
  groupOperatorsAndOperatorData(data) {
    const groupedOperatorData = {};
    for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
      let currentUserId = data[dataIndex].user_id;
      let operatorData = data[dataIndex];
      if (!groupedOperatorData[currentUserId]) {
        groupedOperatorData[currentUserId] = {};
        groupedOperatorData[currentUserId].rounds = {};
        groupedOperatorData[currentUserId].firstName = operatorData.first_name;
        groupedOperatorData[currentUserId].lastName = operatorData.last_name;
        groupedOperatorData[currentUserId].specialRoute = (operatorData.special_route_ok == 1);
        groupedOperatorData[currentUserId].totalHours = null;
      }
      let currentLine = operatorData.line_name + operatorData.bus_number;
      if (!groupedOperatorData[currentUserId].rounds[currentLine]) {
        groupedOperatorData[currentUserId].rounds[currentLine] = [];
      }
      groupedOperatorData[currentUserId].rounds[currentLine].push(operatorData);
    }
    for (var id in groupedOperatorData) {
      var totalHours = 0;
      var rounds = groupedOperatorData[id].rounds;
      for (var line in rounds) {
        totalHours += parseFloat(this.calculateTotalHours(rounds[line]));
      }
      groupedOperatorData[id].totalHours = totalHours;
    }
    this.setState({ operators: groupedOperatorData });
  }
  calculateTotalHours(rounds) {
    var totalHours = 0;
    for (var roundsIndex = 0; roundsIndex < rounds.length; roundsIndex++) {
      var startTime = this.convert24hrTimeToMinutes(parseInt(rounds[roundsIndex].round_start));
      var endTime = this.convert24hrTimeToMinutes(parseInt(rounds[roundsIndex].round_end));
      var totalMinutesDuringRound = endTime - startTime;
      var totalHoursDuringRound = totalMinutesDuringRound / 60;
      totalHours += totalHoursDuringRound;
    }
    return totalHours.toFixed(1);
  }
  convert24hrTimeToMinutes(time) {
    var hours = Math.floor(time / 100);
    var minutes = time - hours * 100;
    return minutes + hours * 60;
  }
  shiftsGroupedByLineAndBus(data) {
    var operatorStats = {};
    var busAndLineObject = {};
    var groupedShifts = [];
    for (var index = 0; index < data.length; index++) {
      var joinedLineAndBusNumber = data[index].line_name + data[index].bus_number;
      busAndLineObject[joinedLineAndBusNumber] = [data[index].line_name, data[index].bus_number];
    }
    // remove the duplicates that still remain in the busAndLineArray
    for (var key in busAndLineObject) {
      var lineName = busAndLineObject[key][0];
      var busNumber = busAndLineObject[key][1];
      groupedShifts.push([lineName, busNumber, this.buildShiftsByLine(data, lineName, busNumber)]);
    }
    console.log('groupedShifts: ', groupedShifts);
    this.setState({ groupedShifts: groupedShifts });
  }
  handleClickAssignShifts() {
    if (this.state.selectingUnassign) {
      return;
    }
    this.setState({ selectingAssign: true });
  }
  handleClickUnassignShifts() {
    if (this.state.selectingAssign) {
      return;
    }
    this.setState({ selectingUnassign: true });
  }
  handleClickCancel() {
    this.setState({
      selectingAssign: false,
      selectingUnassign: false,
      availableOperators: [],
      roundsSelected: [],
      roundTimes: [],
      shiftsSelected: []
    });
  }
  renderSelectModeHeader() {
    if (this.state.selectingAssign) {
      return <h5 className="selectingAssignHeader m-0">Select shifts to assign</h5>;
    } else if (this.state.selectingUnassign) {
      return <h5 className="selectingUnassignHeader m-0">Select shift to unassign</h5>;
    }
  }
  renderAssignCancelButton() {
    if (this.state.selectingAssign) {
      return <button className="cancelButton btn btn-secondary m-2" onClick={this.handleClickCancel}>Cancel</button>;
    }
  }
  renderUnAssignCancelButton() {
    if (this.state.selectingUnassign) {
      return <button className="cancelButton btn btn-secondary m-2" onClick={this.handleClickCancel}>Cancel</button>;
    }
  }
  handleShiftClick(shift) {
    var shiftsSelected = this.state.shiftsSelected;
    if (this.state.selectingAssign) {
      var shiftIndex = shiftsSelected.map(shiftItem => shiftItem.round_id).indexOf(shift.round_id);
      if (shiftIndex > -1) {
        shiftsSelected.splice(shiftIndex, 1);
        this.setState({ shiftsSelected: shiftsSelected });
        return;
      }
    } else {
      shiftsSelected = [];
    }
    if (shift.shift_type === 'nonOperational');
    else {
      shiftsSelected.push(shift);
      this.setState({ shiftsSelected: shiftsSelected });
    }
  }
  handleClickUnassignOperator(event) {
    console.log('event target: ', event.target.id);
    let roundId = event.target.id;
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': 1,
        'rounds': [roundId]
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-update-shifts.php`, data)
      .then(response => { })
      .then(data => {
        this.fetchCallMethod();
        this.setState({
          availableOperators: [],
          roundsSelected: [],
          selectingUnassign: false,
          shiftsSelected: []
        });
      })
      .catch(error => { throw (error); });
  }
  renderLineComponents() {
    const shiftsGroupedByLine = this.state.groupedShifts;
    const elements = [];
    shiftsGroupedByLine.forEach((element, index) => {
      elements.push(
        <div key={index} className="bus-line adminLineRow d-flex justify-content-center border w-100">
          < RouteBusDisplay
            bus={element.bus_number} // bus number
            route={element.line_name} // line letter
          />
        </div>);
    });
    return elements;
  }
  renderShiftComponents() {
    const shiftsGroupedByLine = this.state.groupedShifts;
    var elements = [];
    for (var groupIndex = 0; groupIndex < shiftsGroupedByLine.length; groupIndex++) {
      elements.push(
        <div key={groupIndex} className="adminShiftRows d-flex align-items-center border">
          {shiftsGroupedByLine[groupIndex].shifts.map((element, index) => {
            var roundType = '';
            var selectingType = null;
            if (element.user_id === 'n/a') {
              roundType = 'nonOperational';
            } else if (element.user_id == 1) {
              roundType = 'alertShift';
              selectingType = this.state.selectingAssign;
            } else {
              roundType = 'active';
              selectingType = this.state.selectingUnassign;
            }
            return (
              < AdminShiftsCombinedRounds
                key={index}
                onClickAvailableDrivers={this.getAvailableDrivers}
                type={roundType}
                userId={element.user_id}
                userName={element.user_name}
                rounds={element.rounds}
                roundId={element.round_id}
                range={{ min: 600, max: 2400 }}
                shiftData={{ start: element.start_time.toString(), end: element.end_time.toString() }}
                selecting={selectingType}
                onClickShifts={this.handleShiftClick}
              />
            );
          })}
        </div>
      );
    }
    return elements;
  }
  renderShiftDetailsComponent() {
    if (this.state.shiftsSelected.length) {
      var shiftElements = this.state.shiftsSelected.map(shift =>
        <AdminClickedShiftDetailsAside
          key={shift.round_id}
          userName={shift.user_name}
          userId={shift.user_id}
          shiftTime={shift.shift_time}
          rounds={shift.rounds}
          roundId={shift.round_id}
          shiftType={shift.shift_type}
          onClickUnassignOperator={this.handleClickUnassignOperator}
        />
      );
      return (
        <React.Fragment>
          <div className="shiftDetailsHeader d-flex border justify-content-center align-items-end w-100">
            <h5 className="m-0">Shift details</h5>
          </div>
          <div className="shiftDetailElements d-flex flex-column border w-100">
            {shiftElements}
          </div>
        </React.Fragment>
      );
    }
  }
  renderAvailableOperatorElements() {
    const availableOperatorsElements = this.state.availableOperators.map(operator => {
      return (
        <AdminAvailableOperatorsDisplay
          key={operator.id}
          id={operator.id}
          name={`${operator.lastName}, ${operator.firstName}`}
          dailyHours={operator.totalHours}
          weeklyHours={operator.weeklyHours}
          onClickAssignShift={this.handleClickAssignShift}
        />
      );
    });
    if (availableOperatorsElements.length) {
      return (
        <React.Fragment>
          <h5 className="availableOperatorsHeader d-flex justify-content-center align-items-end border m-0">Available Operators</h5>
          <div className="availableOperatorElements d-flex flex-column">
            {availableOperatorsElements}
          </div>
        </React.Fragment>
      );
    }
  }
  render() {
    return (
      <div>
        <TopMenuShift title="Admin" page='day' date={this.state.dateToPass} />
        <div className="selectShiftsButtonContainer d-flex w-100 px-5">
          <button className="btn btn-primary m-2" onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
          <button className="selectShiftsButton btn btn-primary m-2" onClick={this.handleClickAssignShifts}>Select Shifts to Assign</button>
          <button className="selectShiftsButton btn btn-primary m-2" onClick={this.handleClickUnassignShifts}>Select Shift to Unassign</button>
          <div className="selectModeContainer d-flex flex-fill justify-content-center align-items-center">
            {this.renderSelectModeHeader()}
          </div>
          <div className="cancelButtonContainer d-flex ml-auto">
            {this.renderAssignCancelButton()}
            {this.renderUnAssignCancelButton()}
          </div>
        </div>
        <div className="main-container d-flex px-5 h-100">
          <div className="busHoursShiftsAvailableOperatorsContainer d-flex flex-column col-10 p-0">
            <div className="shiftAndBusLineContainer d-flex">
              <div className="bus-line-container container d-flex flex-column align-items-center p-0">
                <div className="adminLineHeader lineHeaderContainer d-flex justify-content-center align-items-end border w-100">
                  <h5 className="m-0">Lines</h5>
                </div>
                {this.renderLineComponents()}
              </div>
              <div className="hours-populated-shifts-container container d-flex flex-column col-11 p-0">
                <div className="adminHoursRow adminShiftRows view-hours-container d-flex align-items-end border">
                  <HoursOfOperation />
                </div>
                {this.renderShiftComponents()}
              </div>
            </div>
          </div>
          <div className="shiftDetailsAndAvailableOperatorsContainer d-flex flex-column col-2 p-0">
            <div className="ShiftDetailsContainer d-flex flex-column">
              {this.renderShiftDetailsComponent()}
            </div>
            <div className="availableOperatorsContainer d-flex flex-column">
              {this.renderAvailableOperatorElements()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminShiftsDay;
