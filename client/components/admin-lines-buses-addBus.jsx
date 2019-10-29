import React from 'react';

export default class AddBus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newBus: {
        bus_number: null,
        route_id: this.props.line.real_route_id,
        vehicle_id: null,
        start_time: '',
        rounds: '',
        daysActive: '',
        gap: null,
        gapDuration: null,
        opening_duration: null,
        closing_duration: null
      },
      newBusAdded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.setRouteID = this.setRouteID.bind(this);
    this.addNewBus = this.addNewBus.bind(this);
    this.calculateEndTime = this.calculateEndTime.bind(this);
  }

  addNewBus(newBus, e) {
    e.preventDefault();
    newBus = { ...newBus, end_time: this.calculateEndTime() };
    const init = {
      method: 'POST',
      body: JSON.stringify(newBus)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(newBusInfo => {
        this.setState({
          newBusAdded: true
        }, this.props.getLinesBusesInfo);
        console.log('BUS ADDED', newBusInfo);
      })
      .catch(error => console.error(error));
    this.props.handleAddBusButtonClick();
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(prevState => ({
      newBus: {
        ...prevState.newBus,
        [name]: value
      }
    }));
    this.calculateEndTime();
  }

  calculateEndTime() {
    const { line } = this.props;
    const { newBus } = this.state;
    let endTime = null;
    let totalRoundTime = null;
    let amountOfHours = null;
    const roundDuration = parseInt(line.roundDuration);
    const startTime = newBus.start_time;
    const startTimeLength = newBus.start_time.length;
    const rounds = parseInt(newBus.rounds);
    console.log(startTimeLength);
    if (startTime.length !== 4 && !rounds) {
      return '';
    }
    if (startTimeLength === 4 && newBus.start_time[0] === '0') {
      totalRoundTime = rounds * roundDuration;
      amountOfHours = totalRoundTime / 60;
      let startTimeArr = startTime.split('');
      let newHour = startTimeArr.splice(0, 2);
      let newHourStr = newHour.join('');
      let newHourInt = Math.round(parseInt(newHourStr) + amountOfHours);
      let addHourToArr = startTimeArr.splice(0, 0, newHourInt);
      console.log('startTimeArr', startTimeArr);
      if (startTimeArr.length === 3) {
        startTimeArr.unshift(0);
      }
      endTime = startTimeArr.join('');
      console.log('endTime', endTime);
      console.log(endTime);
      return endTime;
    } else if (startTimeLength === 4 && newBus.start_time[0] !== '0') {
      totalRoundTime = rounds * roundDuration;
      amountOfHours = totalRoundTime / 60;
      let startTimeArr = startTime.split('');
      let hour = startTimeArr.splice(0, 2);
      let newHour = hour.join('');
      let newHour2 = parseInt(newHour) + amountOfHours;
      let joinHour = startTimeArr.splice(0, 0, newHour2);
      console.log(startTimeArr);
      endTime = startTimeArr.join('');
      console.log(endTime);
      return endTime;
    }
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
                <input onChange={this.handleChange} className="col border border-primary" type="text" name="bus_number"></input>
              </div>
              <div className="col">
                <label>Start Time</label>
                <input className="col border border-primary" onChange={this.handleChange} type="text" name="start_time" />
              </div>
              <div className="col">
                <label>Rounds</label>
                <input className="col border border-primary" onChange={this.handleChange} type="text" name="rounds" />
              </div>
              <div className="col">
                <label>End Time</label>
                <input value={this.calculateEndTime()} readOnly className="col border border-primary" type="text" name="end_time" />
              </div>
              <div className="col">
                <label>Gap</label>
                <input onChange={this.handleChange} placeholder="Start Time" className="col border border-primary" type="text" name="gap"></input>
              </div>
              <div className="col">
                <label>Specify Days</label>
                <input className="col border border-primary" name="daysActive" type="text" onChange={this.handleChange} placeholder="Ex. Monday, Friday" />
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-2">
                <label>Vehicle ID</label>
                <input className="col border border-primary" type="text" onChange={this.handleChange} name="vehicle_id" />
              </div>
              <div className="col">
                <label>Open Length</label>
                <br />
                <input onChange={this.handleChange} name="opening_duration" className="col border border-primary" type="text" placeholder="Duration"></input>
              </div>
              <div className="col">
                <label>Close Length</label>
                <br />
                <input onChange={this.handleChange} name="closing_duration" type="text" className="col border border-primary" placeholder="Duration"></input>
              </div>
              <div className="col">
                <label>Line/Route ID</label>
                <input readOnly className="col border border-primary" type="text" name="route_id" value={this.props.line.real_route_id}></input>
              </div>
              <div className="col">
                <label>Gap Duration</label>
                <br />
                <input onChange={this.handleChange} name="gapDuration" type="text" className="col border border-primary"></input>
              </div>
              <div className="col d-flex align-self-end">
                <button onClick={e => this.addNewBus(this.state.newBus, e)} className="w-100 addNewBusBtn btn btn-primary" type="submit" name="submit" data-toggle="collapse" style={{ 'fontSize': 20 }}
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
