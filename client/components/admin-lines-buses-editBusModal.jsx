import React from 'react';
import './linesBusesStyle.css';

export default class EditBusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busInfo: null,
      // currentBus: {
      //   id: this.props.busInfo.busID,
      //   bus_number: this.props.busInfo.busNumber,
      //   start_time: this.props.busInfo.startTime,
      //   end_time: this.props.busInfo.endTime,
      //   days: this.props.busInfo.daysActive,
      //   gap: this.props.busInfo.gap,
      //   opening_duration: this.props.busInfo.openingDuration,
      //   closing_duration: this.props.busInfo.closingDuration
      // },
      editBus: { // need ALL information for a PUT method. PATCH should work with only the line being editted.
        id: this.props.busInfo.busID,
        bus_number: this.props.busInfo.busNumber,
        start_time: this.props.busInfo.startTime,
        end_time: this.props.busInfo.endTime,
        days: this.props.busInfo.daysActive,
        gap: this.props.busInfo.gap,
        opening_duration: this.props.busInfo.openingDuration,
        closing_duration: this.props.busInfo.closingDuration
      }
    }
    this.handleEditChange = this.handleEditChange.bind(this);
    this.editBus = this.editBus.bind(this);
  }

  handleEditChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    // let editBus = {
    //   id: this.props.busInfo.busID,
    //   [name]: value,
    // };
    this.setState(prevState => ({
      editBus: {
        ...prevState.editBus,
        [name]: value
      }
    }))
  }

  editBus(id) {
    const myInit = {
      method: 'PATCH',
      body: JSON.stringify(id),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('api/admin-lines-buses.php?id=${this.props.busInfo.activeBuses.busID}', myInit)
      .then(response => response.json())
      .then(busInfo => this.setState({
        busInfo: busInfo
      }))
      .catch(error => console.error(error));
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    if (!this.props.showModal) {
      return null;
    }
    if (!busInfo) {
      return null;
    }
    return (
      <>
        <div className="container editBus">
          <div className="row">
            <div className="offset-11 col d-flex justify-content-end">
              <button onClick={() => this.props.onClose()} className="closeModal btn btn-danger">X</button>
            </div>
          </div>
          <div className="row editRow">
            <table className="card-table table">
              <thead>
                <tr>
                  <th scope="col">Bus Number</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  {/* <th scope="col">Rounds</th> */}
                  <th scope="col">Days</th>
                  <th scope="col">Gap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input defaultValue={busInfo.busNumber} name="bus_number" onChange={this.handleEditChange} type="text" />
                  </td>
                  <td>
                    <input defaultValue={busInfo.startTime} name="start_time" onChange={this.handleEditChange} type="text" />
                  </td>
                  <td>
                    <input defaultValue={busInfo.endTime} name="end_time" onChange={this.handleEditChange} type="text" />
                  </td>
                  <td>
                    <input defaultValue={busInfo.days} name="days" onChange={this.handleEditChange} type="text" />
                  </td>
                  <td>
                    <input defaultValue={busInfo.gap} name="gap" onChange={this.handleEditChange} type="text" />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <label className="editOpeningPeriod">Opening Period</label>
                    <input defaultValue={busInfo.openingDuration} name="opening_duration" onChange={this.handleEditChange} type="text" />
                  </td>
                  <td>
                    <label className="editClosingPeriod">Closing Period</label>
                    <input defaultValue={busInfo.closingDuration} name="closing_duration" onChange={this.handleEditChange} type="text" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="offset-10 col d-flex justify-items-end">
              <button onSubmit={() => this.editBus(busInfo.activeBuses.busID)} type="submit" className="saveChangesBtn btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </>
      );
    }
  }
