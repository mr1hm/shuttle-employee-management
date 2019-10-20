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
    this.handleClickSelectShifts = this.handleClickSelectShifts.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
    const defaultDate = 1566619200;
    this.state = {
      rounds: null,
      availableOperators: [],
      shiftDetailsFromClick: null,
      dateToPass: defaultDate,
      roundsSelected: [],
      roundTimes: [],
      selecting: false,
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
        this.shiftsGroupedByLineAndBus(data);
      })
      .catch(error => { throw (error); });
  }
  getAvailableDrivers(startTime, endTime, roundId, userId) {
    if (!this.state.selecting || userId !== 1) {
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
          selecting: false,
          shiftDetailsFromClick: null
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
    let roundCounter = 0;
    for (var indexSortedArray = 0; indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      let currentUserId = sortedLineAndBusArray[indexSortedArray].user_id;
      const firstName = sortedLineAndBusArray[indexSortedArray].first_name;
      const lastName = sortedLineAndBusArray[indexSortedArray].last_name;
      let displayName = (firstName && lastName) ? lastName + ', ' + firstName : 'n/a';
      if (currentUserId == 1 || currentUserId === 'n/a' || currentUserId !== previousUserId) { //
        roundCounter = 0;
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
          'rounds': roundCounter + 1
        });
        roundCounter = 0;
      } else {
        ++roundCounter;
        shiftsForLine[shiftsForLine.length - 1].end_time = sortedLineAndBusArray[indexSortedArray].round_end;
        shiftsForLine[shiftsForLine.length - 1].rounds = roundCounter + 1;
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
  handleClickSelectShifts() {
    this.setState({ selecting: true });
  }
  handleClickCancel() {
    this.setState({
      selecting: false,
      availableOperators: [],
      roundsSelected: [],
      roundTimes: [],
      shiftDetailsFromClick: null
    });
  }
  showCancelButton() {
    if (this.state.selecting) {
      return <button className="cancelButton btn btn-secondary m-2" onClick={this.handleClickCancel}>Cancel</button>;
    }
  }
  handleShiftClick(response) {
    if (response.shift_type === 'nonOperational') return;
    else this.setState({ shiftDetailsFromClick: response });
  }
  handleClickUnassignOperator(roundId) {
    console.log(event.target.id, this.state.roundsSelected);
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
          selecting: false,
          shiftDetailsFromClick: null
        });
      })
      .catch(error => { throw (error); });
  }
  renderLineComponents() {
    const shiftsGroupedByLine = this.state.groupedShifts;
    const elements = [];
    shiftsGroupedByLine.forEach((element, index) => {
      elements.push(
        <div key={index} className="bus-line adminLineRow d-flex justify-content-center">
          < RouteBusDisplay
            bus={element[1]} // bus number
            route={element[0]} // line letter
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
          {shiftsGroupedByLine[groupIndex][2].map((element, index) => {
            var roundType = '';
            if (element.user_id === 'n/a') {
              roundType = 'nonOperational';
            } else if (element.user_id == 1) {
              roundType = 'alertShift';
            } else {
              roundType = 'active';
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
                shiftData={{ start: element.start_time, end: element.end_time }}
                selecting={this.state.selecting}
                onClickShifts={this.handleShiftClick}
              />
            );
          })}
        </div>
      );
    }
    return elements;
  }
  generateShiftDetailsComponent() {
    if (this.state.shiftDetailsFromClick) {
      return (
        <AdminClickedShiftDetailsAside
          userName={this.state.shiftDetailsFromClick.user_name}
          userId={this.state.shiftDetailsFromClick.user_id}
          shiftTime={this.state.shiftDetailsFromClick.shift_time}
          rounds={this.state.shiftDetailsFromClick.rounds}
          roundId={this.state.shiftDetailsFromClick.round_id}
          shiftType={this.state.shiftDetailsFromClick.shift_type}
          onClickUnassignOperator={this.handleClickUnassignOperator}
        />
      );
    }
  }
  renderAvailableOperatorElements() {
    const availableOperatorsElements = this.state.availableOperators.map(operator => {
      return (
        <AdminAvailableOperatorsDisplay
          key={operator.id}
          id={operator.id}
          onClickAssignShift={this.handleClickAssignShift}
          name={`${operator.lastName}, ${operator.firstName}`}
        />
      );
    });
    if (availableOperatorsElements.length) {
      return (
        <React.Fragment>
          <div className="available-operators">Available Operators</div>
          {availableOperatorsElements}
        </React.Fragment>
      );
    }
  }
  renderTable() {
    return (
      <div className="tableContainer d-flex flex-column position-absolute">
        <div className="border d-flex">
          <div className="tableCell border">600am</div>
          <div className="tableCell border">700am</div>
          <div className="tableCell border">800am</div>
          <div className="tableCell border">900am</div>
          <div className="tableCell border">1000am</div>
          <div className="tableCell border">1100am</div>
          <div className="tableCell border">1200pm</div>
          <div className="tableCell border">100pm</div>
          <div className="tableCell border">200pm</div>
          <div className="tableCell border">300pm</div>
          <div className="tableCell border">400pm</div>
          <div className="tableCell border">500pm</div>
          <div className="tableCell border">600pm</div>
          <div className="tableCell border">700pm</div>
          <div className="tableCell border">800pm</div>
          <div className="tableCell border">900pm</div>
          <div className="tableCell border">1000pm</div>
          <div className="tableCell border">1100pm</div>
          <div className="tableCell border">1200pm</div>
        </div>
        <div className="border d-flex">
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
        </div>
        <div className="border d-flex">
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
        </div>
        <div className="border d-flex">
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
        </div>
        <div className="border d-flex">
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
          <div className="tableCell border"></div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <TopMenuShift title="Admin" page='day' date={this.state.dateToPass} />
        <div className="main-container d-flex px-5 h-100">
          <div className="auto-populate-bus-line-container container d-flex flex-column justify-content-center p-0 mx-2">
            <div className="adminLineHeader lineHeaderContainer d-flex justify-content-center align-items-end">
              <h4 className="lineHeader m-0">Lines</h4>
            </div>
            {this.renderLineComponents()}
          </div>
          <div className="hours-populated-shifts-container container d-flex flex-column col-9 mx-2 p-0">
            <div className="adminHoursRow adminShiftRows view-hours-container d-flex align-items-end border rounded">
              <HoursOfOperation />
            </div>
            {this.renderShiftComponents()}
          </div>
          <div className="additional-info-container container d-flex flex-column col-2 adminShiftRow">
            {this.generateShiftDetailsComponent()}
            {this.renderAvailableOperatorElements()}
          </div>
        </div>
        <div className="selectShiftsButtonContainer">
          <button className="btn btn-primary m-2" onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
          <button className="selectShiftsButton btn btn-primary m-2" onClick={this.handleClickSelectShifts}>Select Shifts to Assign</button>
          {this.showCancelButton()}
        </div>
      </div>
    );
  }
}
export default AdminShiftsDay;
