import React from 'react';
import { parse } from 'url';

export default class AddBus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newBus: {
        bus_number: null,
        route_id: this.props.line.real_route_id,
        vehicle_id: null,
        start_time: '',
        end_time: '',
        rounds: '',
        roundTimes: [],
        roundDuration: this.props.line.roundDuration,
        daysActive: null,
        gap: null,
        gapDuration: null,
        opening_duration: null,
        closing_duration: null,
        session_id: this.props.line.sessionID,
        userID: 1,
        date: 1575281400,
        status: 'unscheduled'
      },
      newBusAdded: false,
      displayGapTimes: [],
      displayGapDurations: [],
      displayDaysActive: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.setRouteID = this.setRouteID.bind(this);
    this.addNewBus = this.addNewBus.bind(this);
    this.calculateEndTime = this.calculateEndTime.bind(this);
    this.calculateRoundTimes = this.calculateRoundTimes.bind(this);
  }

  addNewBus(newBus, sessionID, e) {
    e.preventDefault();
    newBus = { ...this.state.newBus };
    newBus.end_time = this.calculateEndTime();
    newBus.roundTimes = this.calculateRoundTimes();
    let gapTimes = this.state.displayGapTimes.slice();
    let gapDurations = this.state.displayGapDurations.slice();
    let daysActive = this.state.displayDaysActive.slice();
    gapTimes = gapTimes.split(', ');
    gapDurations = gapDurations.split(', ');
    daysActive = daysActive.split(', ');
    newBus = { ...newBus, end_time: this.calculateEndTime(), gap: gapTimes, gapDuration: gapDurations, daysActive: daysActive };
    const init = {
      method: 'POST',
      body: JSON.stringify(newBus)
    };
    fetch(`/api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(newBusInfo => {
        this.setState({
          newBusAdded: true
        }, () => {
          if (this.props.currentSession === 'All Sessions') {
            this.props.getLinesBusesInfo();
          } else {
            this.props.getLinesBusesInfo({ session_id: sessionID });
          }
        });
        console.log('BUS ADDED', newBusInfo);
      })
      .catch(error => console.error(error));
    this.props.handleAddBusButtonClick();
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'gap') {
      // let gapTimes = value;
      // console.log(gapTimes);
      this.setState({
        displayGapTimes: value
      });
    } else if (name === 'gapDuration') {
      // let gapDurations = value;
      // console.log(gapDurations);
      this.setState({
        displayGapDurations: value
      });
    } else if (name === 'daysActive') {
      this.setState({
        displayDaysActive: value
      });
    }
    this.setState(prevState => ({
      newBus: {
        ...prevState.newBus,
        [name]: value
      }
    }));
  }

  calculateEndTime() {

    const { newBus } = this.state;
    if (newBus.start_time.length < 4 || !newBus.rounds) {
      return '';
    }
    const { line } = this.props;
    const roundDuration = parseInt(line.roundDuration);
    const startTime = newBus.start_time;
    const rounds = parseInt(newBus.rounds);

    const totalRoundTimeInMinutes = (rounds * roundDuration);
    let minutesTotalAfterShift = totalRoundTimeInMinutes + parseInt(startTime.substring(startTime.length - 2));
    let hoursTotalFromShift = Math.floor(minutesTotalAfterShift / 60);
    let leftoverMinutesAfterShift = (minutesTotalAfterShift % 60).toString();
    if (leftoverMinutesAfterShift.length < 2) leftoverMinutesAfterShift = '0' + leftoverMinutesAfterShift;
    let hoursEndTime = (parseInt(startTime.substring(0, 2)) + hoursTotalFromShift).toString();
    if (hoursEndTime.length < 2) hoursEndTime = '0' + hoursEndTime;
    let finalEndTime = hoursEndTime + leftoverMinutesAfterShift;

    if (newBus.gapDuration) {
      finalEndTime = parseInt(finalEndTime);
      let gapDurationArr = newBus.gapDuration.split(',');
      for (let i = 0; i < gapDurationArr.length; ++i) {
        finalEndTime += parseInt(gapDurationArr[i]);
      }
      // finalEndTime = parseInt(finalEndTime) + parseInt(newBus.gapDuration);
      finalEndTime = finalEndTime.toString();
      let finalMinutes = parseInt(finalEndTime.substring(finalEndTime.length - 2));
      if (parseInt(finalMinutes) >= 60) {
        let finalMinutesNew = (finalMinutes % 60).toString();
        let extraHours = Math.floor(finalMinutes / 60);
        if (finalMinutesNew.length < 2) {
          finalMinutesNew = '0' + finalMinutesNew;
        }
        let finalHoursNew = parseInt(finalEndTime.substring(0, 2)) + extraHours;
        if (finalHoursNew.length < 2) {
          finalHoursNew = '0' + finalHoursNew;
        }
        let finalTimeNew = finalHoursNew.toString() + finalMinutesNew;
        return finalTimeNew;
      }
    }

    return finalEndTime;
  }

  calculateRoundTimes() {
    let startTime = this.state.newBus.start_time;
    const openingDuration = parseInt(this.state.newBus.opening_duration);
    const closingDuration = parseInt(this.state.newBus.closing_duration);
    const rounds = this.state.newBus.rounds;
    const roundDuration = parseInt(this.props.line.roundDuration);
    let endTime = this.state.newBus.end_time;
    let gapTime = this.state.newBus.gap.slice();
    const gapTimeArr = gapTime.split(',');
    console.log('gaptime: ', gapTimeArr);
    let gapDuration = this.state.newBus.gapDuration.slice();
    const gapDurationArr = gapDuration.split(',');
    console.log('gapduration: ', gapDurationArr);
    const date = new Date();
    const roundTimes = [];
    date.setHours(parseInt(startTime[0] + startTime[1]));
    date.setMinutes(parseInt(startTime[2] + startTime[3]));
    date.setMinutes(date.getMinutes() - openingDuration);
    for (let roundIndex = 0; roundIndex < rounds; roundIndex++) {
      startTime = date.getHours() * 100 + date.getMinutes();
      date.setMinutes(date.getMinutes() + roundDuration);
      if (roundIndex === 0) {
        date.setMinutes(date.getMinutes() + openingDuration);
      }
      if (roundIndex === rounds - 1) {
        date.setMinutes(date.getMinutes() + closingDuration);
      }
      endTime = date.getHours() * 100 + date.getMinutes();
      for (let gapIndex = 0; gapIndex < gapTime.length; gapIndex++) {
        if (gapTimeArr.length && gapDurationArr.length && parseInt(gapTimeArr[gapIndex]) >= startTime && parseInt(gapTimeArr[gapIndex]) < endTime) {
          date.setMinutes(date.getMinutes() + parseInt(gapDurationArr[gapIndex]));
          endTime = date.getHours() * 100 + date.getMinutes();
        }
      }
      roundTimes.push({ start_time: startTime, end_time: endTime });
    }
    console.log('round times: ', roundTimes);
    return roundTimes;
  }

  setRouteID() {
    this.setState({ route_id: this.props.line.real_route_id });
  }

  render() {
    return (
      <div className="card addNewBusCard">
        <div className="card-header" id="headingOne">
          <div className="row align-items-center">
            <div className="col">
              <span className="mr-2">Add New Bus</span>
              {this.props.addBusClicked ? <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ 'fontSize': 20 }}
                data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}
                onClick={this.props.handleAddBusButtonClick}>-</button> : <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ 'fontSize': 20 }}
                data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}
                onClick={this.props.handleAddBusButtonClick}>+</button>}
            </div>
          </div>
        </div>
        <div id={`collapseAddBus${this.props.accordionID}`} className="collapse">
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <label>Bus Number</label>
                <br />
                <input onChange={this.handleChange} className="col border border-primary addBusInputs" type="text" name="bus_number"></input>
              </div>
              <div className="col">
                <label>Start Time</label>
                <input className="col border border-primary addBusInputs" onChange={this.handleChange} type="text" name="start_time" />
              </div>
              <div className="col">
                <label>Rounds</label>
                <input className="col border border-primary addBusInputs" onChange={this.handleChange} type="text" name="rounds" />
              </div>
              <div className="col">
                <label>End Time</label>
                <input value={this.calculateEndTime()} className="col border border-primary addBusInputs" type="text" onChange={this.handleChange} name="end_time" />
              </div>
              <div className="col">
                <label>Gap: </label>
                {this.state.displayGapTimes ? <span><i> {this.state.displayGapTimes}</i></span> : null}
                <input onChange={this.handleChange} placeholder="Start Time" className="col border border-primary addBusInputs" type="text" name="gap"></input>
              </div>
              <div className="col">
                <label>Specify Days: </label>
                {this.state.displayDaysActive ? <span><i> {this.state.displayDaysActive}</i></span> : null}
                <input className="col border border-primary addBusInputs" name="daysActive" type="text" onChange={this.handleChange} placeholder="Ex. Monday, Friday" />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-2">
                <label>Vehicle ID</label>
                <input className="col border border-primary addBusInputs" type="text" onChange={this.handleChange} name="vehicle_id" />
              </div>
              <div className="col">
                <label>Open Length</label>
                <br />
                <input onChange={this.handleChange} name="opening_duration" className="col border border-primary addBusInputs" type="text" placeholder="Duration"></input>
              </div>
              <div className="col">
                <label>Close Length</label>
                <br />
                <input onChange={this.handleChange} name="closing_duration" type="text" className="col border border-primary addBusInputs" placeholder="Duration"></input>
              </div>
              <div className="col">
                <label>Line/Route ID</label>
                <input readOnly className="col border border-primary addBusInputs" type="text" name="route_id" value={this.props.line.real_route_id}></input>
              </div>
              <div className="col">
                <label>Gap Duration: </label>
                {this.state.displayGapDurations ? <span><i> {this.state.displayGapDurations}</i></span> : null}
                <br />
                <input onChange={this.handleChange} name="gapDuration" type="text" className="col border border-primary addBusInputs"></input>
              </div>
              <div className="col d-flex align-self-end">
                <button onClick={e => this.addNewBus(this.state.newBus, this.props.line.sessionID, e)} className="w-100 addNewBusBtn btn btn-primary" type="submit" name="submit" data-toggle="collapse" style={{ 'fontSize': 20 }}
                  data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}>
                    Save & Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
