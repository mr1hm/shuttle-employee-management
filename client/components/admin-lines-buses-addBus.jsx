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
      daysActive: '',
      gap: null,
      gapDuration: null,
      opening_duration: null,
      closing_duration: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.setRouteID = this.setRouteID.bind(this);
    this.addNewBus = this.addNewBus.bind(this);
  }

  componentDidMount() {
    this.setRouteID();
  }

  addNewBus(newBus, e) {
    e.preventDefault();
    const init = {
      method: 'POST',
      body: JSON.stringify(newBus)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(newBusInfo => {
        console.log('BUS ADDED', newBusInfo);
      })
      .catch(error => console.error(error));
      this.props.handleAddBusButtonClick();
      this.props.getLinesBusesInfo();
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  setRouteID() {
    this.setState({route_id: this.props.line.real_route_id});
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
                onClick={this.props.handleAddBusButtonClick}>-</button> : <button className="btn btn-dark btn-sm collapsed" type="button" data-toggle="collapse" style={{ "fontSize": 20 }}
                  data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}
                  onClick={this.props.handleAddBusButtonClick}>+</button>}
            </div>
          </div>

        </div>

        <div id={`collapseAddBus${this.props.accordionID}`} className="collapse">
          <div className="card-body">
            {/* <form method="POST" action="/api/admin-lines-buses.php"> */}
              <div className="row">
                <div className="col-2">
                  <label>Bus Number</label>
                  <br />
                  <input onChange={this.handleChange} className="col border border-primary" type="text" name="bus_number"></input>
                </div>
                <div className="col">
                  <label>Start Time</label>
                  {/* <input className="col border border-primary" type="text" name="active"></input> */}
                  <input className="col border border-primary" onChange={this.handleChange} type="text" name="start_time" />
                </div>
                <div className="col">
                  <label>End Time</label>
                  {/* <input className="col border border-primary" type="text" name="public"></input> */}
                  <input className="col border border-primary" onChange={this.handleChange} type="text" name="end_time" />
                </div>
                <div className="col">
                  <label>Line/Route ID</label>
                  <input onChange={this.handleChange} className="col border border-primary" type="text" name="route_id" value={this.props.line.real_route_id}></input>
                </div>
                <div className="col">
                  <label>Gap</label>
                  <input onChange={this.handleChange} placeholder="Start Time" className="col border border-primary" type="text" name="gap"></input>
                </div>
                <div className="col">
                  <label>Specify Days</label>
                  <input name="daysActive" type="text" onChange={this.handleChange} placeholder="Ex. Monday, Friday" />
                </div>
              </div>

                {/* <div className="col">{routeInfo.public.toString()}</div> */}
                {/* <div className="col">{routeInfo.regular_service.toString()}</div> */}
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
                <div className="col"></div>
                <div className="col">
                  <label>Gap Duration</label>
                  <br />
                  <input onChange={this.handleChange} name="gapDuration" type="text" className="col border border-primary"></input>
                </div>
                <div className="col d-flex align-self-end">
                  <button onClick={(e) => this.addNewBus(this.state, e)} className="w-100 addNewBusBtn btn btn-primary" type="submit" name="submit" data-toggle="collapse" style={{ "fontSize": 20 }}
                  data-target={`#collapseAddBus${this.props.accordionID}`} aria-expanded="false" aria-controls={`#collapseAddBus${this.props.accordionID}`}>
                    Save & Add
                  </button>
                </div>
              </div>
            {/* </form> */}
          </div>
        </div>
      </div>

    );
  }
}
