import React from 'react';

export default class AddBus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bus_number: null,
      route_id: null,
      vehicle_id: null,
      start_time: null,
      end_time: null,
      openDur: null,
      closeDur: null
      // rounds: null,
      // roundsDur: null,
      // days: null
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className="card">
        <div className="card-header" id="headingOne">
          <div className="row align-items-center">
            <div className="col">
              <span className="mr-2">Add New Bus</span>
              {this.props.addBusClicked ? <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ "fontSize": 20 }}
                data-target="#collapseAddNewBus" aria-expanded="false" aria-controls="collapseAddNewBus"
                onClick={() => this.props.addBusButton()}>-</button> : <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ "fontSize": 20 }}
                  data-target="#collapseAddNewBus" aria-expanded="false" aria-controls="collapseAddNewBus"
                  onClick={() => this.props.addBusButton()}>+</button>}
            </div>
          </div>

        </div>

        <div id="collapseAddNewBus" className="collapse" aria-labelledby="headingOne" data-parent="#accordion">
          <div className="card-body">
            <form method="POST" action="/api/admin-lines-buses.php">
              <div className="row">

                <div className="col-2">
                  <label>Bus Number</label>
                  <br />
                  <input onChange={this.handleChange} className="col border border-primary" type="text" name="busNumber"></input>
                </div>
                <div className="col">
                  <label>Start Time</label>
                  {/* <input className="col border border-primary" type="text" name="active"></input> */}
                  <select onChange={this.handleChange} className="col border border-primary" type="text" name="startTime">
                    <option>0600</option>
                    <option>0600</option>
                    <option>0600</option>
                    <option>0600</option>
                    <option>0600</option>
                  </select>
                </div>
                <div className="col">
                  <label>End Time</label>
                  {/* <input className="col border border-primary" type="text" name="public"></input> */}
                  <select onChange={this.handleChange} className="col border border-primary" type="text" name="endTime">
                    <option>2400</option>
                    <option>2400</option>
                    <option>2400</option>
                    <option>2400</option>
                    <option>2400</option>
                  </select>
                </div>
                <div className="col">
                  <label>Rounds</label>
                  <input onChange={this.handleChange} className="col border border-primary" type="text" name="rounds"></input>
                </div>
                <div className="col">
                  <label>Select Days</label>
                    <select className="custom-select" id="basic" multiple="multiple">
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                </div>
              </div>

                {/* <div className="col">{routeInfo.public.toString()}</div> */}
                {/* <div className="col">{routeInfo.regular_service.toString()}</div> */}
              <div className="row align-items-center">
                <div className="col offset-2">
                  <label>Open Length</label>
                  <br />
                  <input onChange={this.handleChange} name="openDur" className="col border border-primary" type="text" placeholder="Duration"></input>
                </div>
                <div className="col">
                  <label>Close Length</label>
                  <br />
                  <input onChange={this.handleChange} name="closeDur" type="text" className="col border border-primary" placeholder="Duration"></input>
                </div>
                <div className="col">
                  <label>Duration</label>
                  <br />
                  <input onChange={this.handleChange} name="roundsDur" type="text" className="col border border-primary"></input>
                </div>
                <div className="col d-flex align-self-end">
                  <button onSubmit={() => this.props.addBus(this.state)} className="w-100 addNewBusBtn btn btn-primary" type="submit" name="submit" >
                    Save & Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    );
  }
}
