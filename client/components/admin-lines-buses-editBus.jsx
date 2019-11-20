import React from 'react';
import './linesBusesStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose, faBan, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default class EditBusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busInfo: null,
      editBus: {
        id: this.props.busInfo.busID,
        bus_number: this.props.busInfo.busNumber,
        start_time: this.props.busInfo.startTime,
        rounds: this.props.busInfo.rounds,
        end_time: this.props.busInfo.endTime,
        daysActive: this.props.busInfo.daysActive,
        gap: this.props.busInfo.gap,
        gapDuration: this.props.busInfo.gapDuration,
        opening_duration: this.props.busInfo.openingDuration,
        closing_duration: this.props.busInfo.closingDuration
      }
    };
    this.handleEditChange = this.handleEditChange.bind(this);
    this.editBus = this.editBus.bind(this);
  }

  handleEditChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      editBus: {
        ...prevState.editBus,
        [name]: value
      }
    }));
    // this.calculateEndTime();
  }

  editBus(bus, sessionID) {
    const body = { ...bus, end_time: this.calculateEndTime() };
    const init = {
      method: 'POST',
      body: JSON.stringify(body)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(busInfo => {
        console.log(busInfo);
        this.setState({
          editBus: busInfo
        }, this.props.handleEditBusClicked);
        if (this.props.currentSession === 'All Sessions') {
          this.props.getLinesBusesInfo();
        }
        this.props.getLinesBusesInfo({ session_id: sessionID });
      })
      .catch(error => console.error(error));
  }

  calculateEndTime() {
    const { line } = this.props;
    const { editBus } = this.state;
    let endTime = null;
    let totalRoundTime = null;
    let amountOfHours = null;
    const roundDuration = parseInt(line.roundDuration);
    const startTime = editBus.start_time;
    const startTimeLength = editBus.start_time.length;
    const rounds = parseInt(editBus.rounds);
    // console.log(startTimeLength);
    if (startTime.length !== 4 && !rounds) {
      return '';
    }
    if (startTimeLength === 4 && editBus.start_time[0] === '0') {
      totalRoundTime = rounds * roundDuration;
      amountOfHours = totalRoundTime / 60;
      let startTimeArr = startTime.split('');
      let newHour = startTimeArr.splice(0, 2);
      let newHourStr = newHour.join('');
      let newHourInt = Math.round(parseInt(newHourStr) + amountOfHours);
      let newHourIntStr = newHourInt + '';
      let splitNewHourStr = newHourIntStr.split('');
      // console.log('splitNewHourStr', splitNewHourStr);
      if (splitNewHourStr[1]) {
        let addHourToArr = startTimeArr.splice(0, 0, splitNewHourStr[0], splitNewHourStr[1]);
      }
      let addHourToArr = startTimeArr.splice(0, 0, splitNewHourStr[0]);
      console.log('startTimeArr', startTimeArr);
      if (startTimeArr.length === 3) {
        startTimeArr.unshift(0);
      } else if (startTimeArr.length === 5) {
        startTimeArr.shift();
      }
      endTime = startTimeArr.join('');
      console.log('endTime', endTime);
      console.log(endTime);
      return endTime;
    } else if (startTimeLength === 4 && editBus.start_time[0] !== '0') {
      totalRoundTime = rounds * roundDuration;
      amountOfHours = totalRoundTime / 60;
      let startTimeArr = startTime.split('');
      let hour = startTimeArr.splice(0, 2);
      let newHour = hour.join('');
      let newHour2 = parseInt(newHour) + amountOfHours;
      let joinHour = startTimeArr.splice(0, 0, newHour2);
      // console.log(startTimeArr);
      endTime = startTimeArr.join('');
      // console.log(endTime);
      return endTime;
    }
  }

  render() {
    const { line } = this.props;
    const { busInfo } = this.props;
    if (!busInfo) {
      return null;
    }
    if (this.props.editBusClicked) {
      return (
        <tbody>
          <tr className="editBusTableInfo">
            <td>
              <input className="editBusInputs" defaultValue={busInfo.busNumber} name="bus_number" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input className="editBusInputs" defaultValue={busInfo.startTime} name="start_time" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input className="editBusInputs" defaultValue={busInfo.rounds} name="rounds" onChange={this.handleEditChange} type="text"/>
            </td>
            <td>
              <input className="editBusInputs" defaultValue={busInfo.endTime} name="end_time" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input className="editBusInputs" defaultValue={busInfo.daysActive} name="daysActive" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input className="editBusInputs" defaultValue={busInfo.gap} name="gap" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <button onClick={this.props.handleEditBusClicked} className="w-40 closeModal btn btn-warning">
                <FontAwesomeIcon icon={faBan} />
              </button>
            </td>
          </tr>
          <tr className="editBusTableInfo">
            <td></td>
            <td>
              <label className="editOpeningDuration">Opening Duration</label>
              <br/>
              <input className="editBusInputs" defaultValue={busInfo.openingDuration} name="opening_duration" onChange={this.handleEditChange} type="text" />
            </td>
            <td></td>
            <td>
              <label className="editClosingDuration">Closing Duration</label>
              <br/>
              <input className="editBusInputs" defaultValue={busInfo.closingDuration} name="closing_duration" onChange={this.handleEditChange} type="text" />
            </td>
            <td></td>
            <td>
              <label className="editGapDuration">Gap Duration</label>
              <br />
              <input className="editBusInputs" defaultValue={busInfo.gapDuration} name="gapDuration" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <button onClick={() => this.editBus(this.state.editBus, line.sessionID)} type="submit" className="w-40 saveChangesBtn btn btn-success">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </td>
          </tr>
        </tbody>
      );
    }
  }
}
