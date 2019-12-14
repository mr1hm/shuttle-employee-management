import React from 'react';
import TopMenuAdminDay from './topmenu/topmenu-admin-day';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import AdminClickedShiftDetailsAside from './admin-shifts-clicked-details-aside';
import AdminShiftsCombinedRounds from './admin-shifts-combined-rounds';
import AdminAvailableOperator from './admin-available-operator';
import AdminUnavailableOperator from './admin-unavailable-operator';
import { getZeroPaddedNumber, returnWeekInfoArray } from '../lib/time-functions';
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
    this.handleClickUnassignShift = this.handleClickUnassignShift.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleClickUnassignOperator = this.handleClickUnassignOperator.bind(this);
    const today = new Date();
    this.state = {
      date: `${today.getFullYear()}-${getZeroPaddedNumber(today.getMonth() + 1)}-${getZeroPaddedNumber(today.getDate())}`,
      week: null,
      availableOperators: [],
      operatorSelected: { name: 'n/a', id: 'n/a' },
      shiftsSelected: [],
      roundsSelected: [],
      roundTimes: [],
      roundsToUnassign: [],
      shiftsToUnassign: [],
      selectingAssign: false,
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
  getTodaysShiftData(dateString) {
    fetch(`/api/admin-day-shifts.php?date=${dateString}`)
      .then(response => response.json())
      .then(data => {
        console.log('todays data: ', data);
        this.setState({
          groupedShifts: data,
          week: returnWeekInfoArray(dateString),
          selectingAssign: false,
          selectingUnassign: false,
          shiftsSelected: [],
          availableOperators: []
        });
      })
      .catch(error => { throw (error); });
  }
  getAvailableDrivers(startTime, endTime, roundId, userId, lineBus) {
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
        'round_start': startTime,
        'round_end': endTime
      });
    }
    if (roundTimes.length === 0) {
      this.setState({
        roundsSelected: [],
        roundTimes: [],
        availableOperators: []
      });
      return;
    }
    var roundTimesString = JSON.stringify(this.state.roundTimes);
    fetch(`/api/admin-available-operators.php?date=${this.state.date}&round_time=${roundTimesString}&line_bus=${lineBus}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          availableOperators: data,
          roundsSelected: roundsSelected,
          roundTimes: roundTimes
        });
      })
      .catch(error => { throw (error); });
  }
  // when admin clicks on a day of the week in the nav get new shift data for that day
  handleClickGoToDay(dateString) {
    this.getTodaysShiftData(dateString);
    this.setState({
      date: dateString
    });
  }
  handleClickAssignShift(name, id) {
    console.log('rounds selected: ', this.state.roundsSelected);
    console.log('shifts selected: ', this.state.shiftsSelected);
    this.setState({
      operatorSelected: {
        name: name,
        id: id
      }
    });
  }
  // click handler for the confirm modal to assign shift
  handleClickAssignShiftConfirm(id, assignStatus) {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': id,
        'rounds': this.state.roundsSelected,
        'assign_status': assignStatus,
        'shifts': this.state.shiftsSelected,
        'date': this.state.date
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
  // click handler for the confirm modal to unassign shift
  handleClickUnassignOperator(id, assignStatus) {
    let rounds = this.state.roundsToUnassign;
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': 1,
        'unassign_id': id,
        'date': this.state.date,
        'rounds': rounds,
        'round_times': this.state.shiftsToUnassign,
        'shifts': this.state.shiftsSelected,
        'assign_status': assignStatus
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
  // switches to assign shift mode so admin can select multiple shifts to assign
  handleClickAssignShifts() {
    if (this.state.selectingAssign) {
      return;
    }
    this.setState({
      selectingAssign: true,
      shiftsSelected: []
    });
  }
  // sets which rounds(an array of round ids) and shifts(an array of shift times)
  // to unassign before confirming with modal
  handleClickUnassignShift(rounds, shifts) {
    console.log('rounds: ', rounds);
    console.log('shifts: ', shifts);
    console.log('shiftsSelected: ', this.state.shiftsSelected);
    this.setState({
      selectingUnassign: true,
      roundsToUnassign: rounds,
      shiftsToUnassign: shifts
    });
  }
  // resets all assign/unassign data to empty
  handleClickCancel() {
    this.setState({
      selectingAssign: false,
      availableOperators: [],
      roundsSelected: [],
      roundTimes: [],
      shiftsSelected: []
    });
  }
  // sets which shift is selected to display on side of schedule
  handleShiftClick(shift) {
    if (shift.shiftType === 'nonOperational') {
      return;
    }
    var shiftsSelected = this.state.shiftsSelected;
    var shiftIndex = shiftsSelected.map(shiftItem => shiftItem.roundId).indexOf(shift.roundId);
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
  componentDidMount() {
    this.getTodaysShiftData(this.state.date);
  }
  // renders a header when 'select shifts to assign' button is clicked
  renderAssignCancelButtonAndHeader() {
    if (this.state.selectingAssign) {
      return (
        <React.Fragment>
          <div className="cancelButtonContainer d-flex">
            <button className="cancelButton btn btn-secondary m-2" onClick={this.handleClickCancel}>Cancel</button>
          </div>
          <div className="selectModeContainer d-flex justify-content-center align-items-center ml-5">
            <h3 className="selectingAssignHeader m-0">Select shifts to assign</h3>
          </div>
        </React.Fragment>
      );
    }
  }
  // renders the route line and bus number inside a colored div (first column in schedule)
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
  // renders colored divs as rounded rectangles on schedule for each row
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
          selectingType = this.state.selectingAssign;
        }
        return (
          < AdminShiftsCombinedRounds
            key={element.round_id + element.line_bus_name + index}
            onClickAvailableDrivers={this.getAvailableDrivers}
            type={roundType}
            sessionId={element.session_id}
            userId={element.user_id}
            lineBus={element.line_bus_name}
            userName={element.user_name}
            rounds={element.rounds}
            roundId={element.round_id}
            range={{ min: 600, max: 2400 }}
            shiftData={{ start: element.start_time, end: element.end_time }}
            selecting={selectingType}
            shiftSelected={this.state.shiftsSelected.length ? this.state.shiftsSelected[0].roundId : -1}
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
  // when a shift is clicked, render an AdminClickedShiftDetailsAside component to the right of the schedule
  // when 'select shifts to assign' button is clicked multiple unassigned shifts can be clicked and all clicked shifts
  // will be rendered in the order they were clicked
  renderShiftDetailsComponent() {
    if (this.state.shiftsSelected.length) {
      var shiftElements = this.state.shiftsSelected.map(shift =>
        <AdminClickedShiftDetailsAside
          key={shift.roundId}
          userName={shift.userName}
          userId={shift.userId}
          busInfoId={shift.bus_info_id}
          lineBus = {shift.lineBus}
          shiftTime={shift.shiftTime}
          rounds={shift.rounds}
          roundId={shift.roundId}
          shiftType={shift.shiftType}
          operatorSelected={this.handleClickAssignShift}
          onClickShifts={this.handleShiftClick}
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
  // when an unassigned shift is clicked, render an AdminAvailabeOperator component to the right of the schedule
  // this component will be rendered below the AdminClickedShiftDetailsAside component
  // when an unassigned shift is clicked, render an AdminUnavailableOperator component to the right of the schedule
  // this component will be rendered below the AdminAvailableOperator components
  renderAvailableOperatorElements() {
    const availableOperatorElements = [];
    const availableOperators = this.state.availableOperators;
    for (let op in availableOperators) {
      if (availableOperators[op]['available']) {
        availableOperatorElements.push(
          <AdminAvailableOperator
            key={availableOperators[op].user_id}
            id={availableOperators[op].user_id}
            name={`${availableOperators[op].last_name}, ${availableOperators[op].first_name}`}
            dailyHours={availableOperators[op].total_daily_minutes / 60}
            weeklyHours={availableOperators[op].total_weekly_minutes / 60}
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
    const unavailableOperators = this.state.availableOperators;
    for (let op in unavailableOperators) {
      if (!unavailableOperators[op]['available']) {
        unavailableOperatorElements.push(
          <AdminUnavailableOperator
            key={unavailableOperators[op].user_id}
            id={unavailableOperators[op].user_id}
            name={`${unavailableOperators[op].last_name}, ${unavailableOperators[op].first_name}`}
            unavailableReasons={unavailableOperators[op]['unavailable_reasons']} />
        );
      }
    }
    if (unavailableOperatorElements.length) {
      return (
        <React.Fragment>
          <div className="unavailableOperatorsContainer d-flex flex-column">
            <h6 className="availableOperatorsHeader card-title d-flex justify-content-center align-items-end border py-1 m-0 mt-1">Unavailable Operators</h6>
            <div className="availableOperatorElements d-flex flex-column">
              {unavailableOperatorElements}
            </div>
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
          {this.renderAssignCancelButtonAndHeader()}
        </div>
        <div className="mainContainer d-flex px-5 h-100">
          <div className="shiftAndBusLineContainer d-flex col-10 p-0">
            <div className="busLineContainer container d-flex flex-column align-items-center p-0">
              <div className="adminLineHeader lineHeaderContainer d-flex justify-content-center align-items-end border w-100">
                <h5 className="m-0">Lines</h5>
              </div>
              {this.renderLineComponents()}
            </div>
            <div className="hoursPopulatedShiftsContainer d-flex flex-column flex-grow-1 border-right p-0">
              <div className="adminHoursRow adminShiftRows view-hours-container d-flex align-items-end border">
                <HoursOfOperation />
              </div>
              {this.renderShiftComponents()}
            </div>
          </div>
          <div className="shiftDetailsAndAvailableOperatorsContainer d-flex flex-column col-2 p-0 ml-1">
            <div className="ShiftDetailsContainer d-flex flex-column">
              {this.renderShiftDetailsComponent()}
            </div>
            {this.renderAvailableOperatorElements()}
            {this.renderUnavailableOperatorElements()}
          </div>
        </div>
        <AdminConfirmModal // modal to confirm assign/unassign
          assign={this.state.selectingAssign}
          unassign={this.state.selectingUnassign}
          rounds={this.state.roundsToUnassign}
          shifts={this.state.shiftsSelected}
          shiftsToUnassign={this.state.shiftsToUnassign}
          operator={this.state.operatorSelected}
          onClickConfirmAssign={this.handleClickAssignShiftConfirm}
          onClickConfirmUnassign={this.handleClickUnassignOperator} />
      </div>
    );
  }
}
export default AdminShiftsDay;
