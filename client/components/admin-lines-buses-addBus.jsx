import React from 'react';

export default class AddBus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busNumber: null,
      start_time: null,
      end_time: null
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
      <div className="card addNewBusCard">
        <div className="card-header" id="headingOne">
          <div className="row align-items-center">
            <div className="col">
              <span className="mr-2">Add New Bus</span>
              {this.props.addBusClicked ? <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ "fontSize": 20 }}
                data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}
                onClick={this.props.handleAddBusButton}>-</button> : <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ "fontSize": 20 }}
                  data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}
                  onClick={this.props.handleAddBusButton}>+</button>}
            </div>
          </div>

        </div>

        <div id={`collapseAddBus${this.props.accordionID}`} className="collapse">
          <div className="card-body">
            <form method="POST" action="/api/admin-lines-buses.php">
              <div className="row">

                <div className="col-2">
                  <label>Bus Number</label>
                  <br />
                  <input onChange={this.handleChange} className="col border border-primary" type="text" name="bus_number"></input>
                </div>
                <div className="col">
                  <label>Start Time</label>
                  {/* <input className="col border border-primary" type="text" name="active"></input> */}
                  <select onChange={this.handleChange} className="col border border-primary" type="text" name="start_time">
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
                  <select onChange={this.handleChange} className="col border border-primary" type="text" name="end_time">
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
                  <label>Gap</label>
                  <input placeholder="Start Time"className="col border border-primary" type="text" name="gap"></input>
                </div>
                <div className="col">
                  <label>Select Days</label>
                    <select className="custom-select" id="basic" multiple="multiple">
                      <option value="Saturday">Sunday</option>
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
                <div className="col-2">
                  <label>Vehicle ID</label>
                  <select className="col border border-primary" name="vehicleID">
                    <option>AE-01</option>
                    <option>AE-02</option>
                    <option>AE-03</option>
                    <option>AE-04</option>
                    <option>AE-05</option>
                    <option>AE-06</option>
                    <option>AE-07</option>
                    <option>AE-08</option>
                    <option>AE-09</option>
                    <option>AE-10</option>
                    <option>AE-11</option>
                    <option>AE-12</option>
                    <option>AE-13</option>
                    <option>AE-14</option>
                    <option>AE-15</option>
                    <option>AE-16</option>
                    <option>AE-17</option>
                    <option>AE-18</option>
                    <option>AE-19</option>
                    <option>AE-20</option>
                    <option>AE-21</option>
                  </select>
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
                  <label>Duration</label>
                  <br />
                  <input onChange={this.handleChange} name="roundsDur" type="text" className="col border border-primary"></input>
                </div>
                <div className="col">
                  <label>Gap Duration</label>
                  <br />
                  <input onChange={this.handleChange} name="gapDuration" type="text" className="col border border-primary"></input>
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
