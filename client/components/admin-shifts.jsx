import React from 'react';
import TopMenuAdminDay from './topmenu/topmenu-admin-day';
import AdminWeekNav from './admin-week-nav';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import AdminClickedShiftDetailsAside from './admin-shifts-clicked-details-aside';
import AdminShiftsCombinedRounds from './admin-shifts-combined-rounds';
import AdminAvailableOperator from './admin-available-operator';
import AdminUnavailableOperator from './admin-unavailable-operator';
import { returnWeekInfoArray } from '../lib/time-functions';
import './admin-shifts-display.css';
import AdminConfirmModal from './admin-confirm-modal';
class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.handleShiftClick = this.handleShiftClick.bind(this);
    this.getTodaysShiftData = this.getTodaysShiftData.bind(this);
    this.autopopulateAndFetchData = this.autopopulateAndFetchData.bind(this);
    this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.handleClickGoToDay = this.handleClickGoToDay.bind(this);
    this.handleClickAssignShift = this.handleClickAssignShift.bind(this);
    this.handleClickAssignShifts = this.handleClickAssignShifts.bind(this);
    this.handleClickAssignShiftConfirm = this.handleClickAssignShiftConfirm.bind(this);
    this.handleClickUnassignShifts = this.handleClickUnassignShifts.bind(this);
    this.handleClickUnassignShift = this.handleClickUnassignShift.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
    const defaultDate = 1566619200;
    this.state = {
      date: defaultDate,
      week: null,
      rounds: null,
      availableOperators: [],
      operatorSelected: { name: 'n/a', id: 'n/a' },
      shiftsSelected: [],
      roundsSelected: [],
      roundTimes: [],
      roundToUnassign: null,
      selectingAssign: false,
      selectingUnassign: false,
      groupedShifts: []
    };
  }
  // updating the db with the autopopulated rounds
  autopopulateAndFetchData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
      .then(() => {
        this.getTodaysShiftData(this.state.date);
      })
      .catch(error => { throw (error); });
  }
  // get assigned/unassigned rounds from database
  getTodaysShiftData(timestamp) {
    console.log('todays date: ', timestamp);
    fetch(`/api/admin-day-shifts.php?date=${timestamp}`)
      .then(response => response.json())
      .then(data => {
        console.log('todays data: ', data);
        this.setState({
          groupedShifts: data,
          date: timestamp,
          week: returnWeekInfoArray(timestamp),
          selectingAssign: false,
          selectingUnassign: false,
          shiftsSelected: [],
          availableOperators: []
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
    fetch(`/api/admin-available-operators.php?date=${this.state.date}&sunday=${this.state.week[0].unix}&saturday=${this.state.week[6].unix}&round_time=${roundTimesString}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log('available operators: ', data);
        this.setState({
          availableOperators: data,
          roundsSelected: roundsSelected,
          roundTimes: roundTimes
        });
      })
      .catch(error => { throw (error); });
  }
  handleClickGoToDay(timestamp) {
    this.getTodaysShiftData(timestamp);
  }
  handleClickAssignShift(name, id) {
    this.setState({
      operatorSelected: {
        name: name,
        id: id
      }
    });
  }
  handleClickAssignShiftConfirm(id) {
    console.log(id, this.state.roundsSelected);
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': id,
        'rounds': this.state.roundsSelected
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-update-shifts.php`, data)
      .then(response => { })
      .then(data => {
        this.getTodaysShiftData(this.state.date);
        this.setState({
          availableOperators: [],
          roundsSelected: [],
          selectingAssign: false,
          shiftsSelected: [],
          roundTimes: []
        });
      })
      .catch(error => { throw (error); });
  }
  handleClickAssignShifts() {
    if (this.state.selectingUnassign) {
      return;
    }
    this.setState({
      selectingAssign: true,
      shiftsSelected: []
    });
  }
  handleClickUnassignShifts() {
    if (this.state.selectingAssign) {
      return;
    }
    this.setState({
      selectingUnassign: true,
      shiftsSelected: []
    });
  }
  handleClickUnassignShift(event) {
    this.setState({ roundToUnassign: event.target.id });
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
  handleShiftClick(shift) {
    if (shift.shift_type === 'nonOperational') {
      return;
    }
    var shiftsSelected = this.state.shiftsSelected;
    var shiftIndex = shiftsSelected.map(shiftItem => shiftItem.round_id).indexOf(shift.round_id);
    if (shiftIndex > -1) {
      shiftsSelected.splice(shiftIndex, 1);
      this.setState({ shiftsSelected: shiftsSelected });
      return;
    }
    if (this.state.selectingAssign) {
      shiftsSelected.push(shift);
      this.setState({ shiftsSelected: shiftsSelected });
    } else if (this.state.selectingUnassign || (!this.state.selectingUnassign && !this.state.selectingAssign)) {
      shiftsSelected = [shift];
      this.setState({
        shiftsSelected: shiftsSelected
      });

    }
  }
  handleClickUnassignOperator() {
    let roundId = this.state.roundToUnassign;
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
        this.getTodaysShiftData(this.state.date);
        this.setState({
          availableOperators: [],
          roundsSelected: [],
          selectingUnassign: false,
          shiftsSelected: [],
          roundTimes: []
        });
      })
      .catch(error => { throw (error); });
  }
  componentDidMount() {
    this.getTodaysShiftData(this.state.date);
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
    if (shiftsGroupedByLine.length === 0) {
      return <h1 className="noDataAvailable">No Shifts Available</h1>;
    }
    var shiftRowArray = [];
    for (var groupIndex = 0; groupIndex < shiftsGroupedByLine.length; groupIndex++) {
      var shiftRow = shiftsGroupedByLine[groupIndex].shifts.map((element, index) => {
        var roundType = '';
        var selectingType = null;
        if (element.user_id === 'n/a') {
          roundType = 'nonOperational';
        } else if (element.user_id === 1 || element.user_id === '1') {
          roundType = 'alertShift';
          selectingType = this.state.selectingAssign;
        } else {
          roundType = 'active';
          selectingType = this.state.selectingUnassign;
        }
        return (
          < AdminShiftsCombinedRounds
            key={element.round_id + element.line_bus_name + index}
            onClickAvailableDrivers={this.getAvailableDrivers}
            type={roundType}
            userId={element.user_id}
            lineBus={element.line_bus_name}
            userName={element.user_name}
            rounds={element.rounds}
            roundId={element.round_id}
            range={{ min: 600, max: 2400 }}
            shiftData={{ start: element.start_time, end: element.end_time }}
            selecting={selectingType}
            shiftSelected={this.state.shiftsSelected.length ? this.state.shiftsSelected[0].round_id : -1}
            onClickShifts={this.handleShiftClick}
          />
        );
      });
      shiftRowArray.push(shiftRow);
    }
    var elements = [];
    for (groupIndex = 0; groupIndex < shiftsGroupedByLine.length; groupIndex++) {
      elements.push(<div key={groupIndex + this.state.date} className="adminShiftRows d-flex align-items-center border">
        {shiftRowArray[groupIndex]}
      </div>);
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
          lineBus = {shift.line_bus}
          shiftTime={shift.shift_time}
          rounds={shift.rounds}
          roundId={shift.round_id}
          shiftType={shift.shift_type}
          onClickUnassignOperator={this.handleClickUnassignShift}
        />
      );
      return (
        <React.Fragment>
          <h6 className="shiftDetailsHeader card-title d-flex justify-content-center align-items-end border py-1 m-0">Shift Details</h6>
          <div className="shiftDetailElements d-flex flex-column w-100">
            {shiftElements}
          </div>
        </React.Fragment>
      );
    }
  }
  renderAvailableOperatorElements() {
    const availableOperatorElements = [];
    const availableOperators = this.state.availableOperators;
    for (let operatorIndex = 0; operatorIndex < availableOperators.length; operatorIndex++) {
      if (availableOperators[operatorIndex]['availability']['available']) {
        availableOperatorElements.push(
          <AdminAvailableOperator
            key={availableOperators[operatorIndex].id}
            id={availableOperators[operatorIndex].id}
            name={`${availableOperators[operatorIndex].lastName}, ${availableOperators[operatorIndex].firstName}`}
            dailyHours={availableOperators[operatorIndex].totalHours}
            weeklyHours={availableOperators[operatorIndex].weeklyHours}
            onClickAssignShift={this.handleClickAssignShift} />
        );
      }
    }
    if (availableOperatorElements.length) {
      return (
        <React.Fragment>
          <h6 className="availableOperatorsHeader card-title d-flex justify-content-center align-items-end border py-1 m-0 mt-1">Available Operators</h6>
          <div className="availableOperatorElements d-flex flex-column">
            {availableOperatorElements}
          </div>
        </React.Fragment>
      );
    }
  }
  renderUnavailableOperatorElements() {
    const unavailableOperatorElements = [];
    const availableOperators = this.state.availableOperators;
    for (let operatorIndex = 0; operatorIndex < availableOperators.length; operatorIndex++) {
      if (!availableOperators[operatorIndex]['availability']['available']) {
        unavailableOperatorElements.push(
          <AdminUnavailableOperator
            key={availableOperators[operatorIndex].id}
            id={availableOperators[operatorIndex].id}
            name={`${availableOperators[operatorIndex].lastName}, ${availableOperators[operatorIndex].firstName}`}
            unavailableReasons={availableOperators[operatorIndex]['availability']['reasons']} />
        );
      }
    }
    if (unavailableOperatorElements.length) {
      return (
        <React.Fragment>
          <h6 className="availableOperatorsHeader card-title d-flex justify-content-center align-items-end border py-1 m-0 mt-1">Unavailable Operators</h6>
          <div className="availableOperatorElements d-flex flex-column">
            {unavailableOperatorElements}
          </div>
        </React.Fragment>
      );
    }
  }
  render() {
    return (
      <div>
        <TopMenuAdminDay userId={this.props.userId} title="Admin" page='day' date={this.state.date} onClickDayOfWeek={this.handleClickGoToDay}/>
        <div className="selectShiftsButtonContainer d-flex w-100 px-5">
          <button className="btn btn-primary m-2" onClick={this.autopopulateAndFetchData}> AUTO POPULATE </button>
          <button
            className={`selectShiftsButton btn btn-success border m-2`}
            onClick={this.handleClickAssignShifts}>
            Select Shifts to Assign
          </button>
          <button
            className={`selectShiftsButton btn btn-danger border m-2`}
            onClick={this.handleClickUnassignShifts}>
            Select Shift to Unassign
          </button>
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
              <div className="hours-populated-shifts-container d-flex flex-column border-right col-11 p-0">
                <div className="adminHoursRow adminShiftRows view-hours-container d-flex align-items-end border">
                  <HoursOfOperation />
                </div>
                {this.renderShiftComponents()}
              </div>
            </div>
          </div>
          <div className="shiftDetailsAndAvailableOperatorsContainer d-flex flex-column col-2 p-0 ml-1">
            <div className="ShiftDetailsContainer d-flex flex-column">
              {this.renderShiftDetailsComponent()}
            </div>
            <div className="availableOperatorsContainer d-flex flex-column">
              {this.renderAvailableOperatorElements()}
            </div>
            <div className="unavailableOperatorsContainer d-flex flex-column">
              {this.renderUnavailableOperatorElements()}
            </div>
          </div>
        </div>
        <AdminConfirmModal
          assign={this.state.selectingAssign}
          unassign={this.state.selectingUnassign}
          round={this.state.roundToUnassign}
          shifts={this.state.shiftsSelected}
          operator={this.state.operatorSelected}
          onClickConfirmAssign={this.handleClickAssignShiftConfirm}
          onClickConfirmUnassign={this.handleClickUnassignOperator} />
      </div>
    );
  }
}
export default AdminShiftsDay;
