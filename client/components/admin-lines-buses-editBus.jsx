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
        end_time: this.props.busInfo.endTime,
        daysActive: this.props.busInfo.daysActive,
        gap: this.props.busInfo.gap,
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
  }

  editBus(bus) {
    const init = {
      method: 'POST',
      body: JSON.stringify(bus)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(busInfo => {
        console.log(busInfo);
        this.setState({
          editBus: busInfo
        });
        this.props.handleEditBusClicked();
        this.props.getLinesBusesInfo();
      })
      .catch(error => console.error(error));
  }

  render() {
    console.log('editing');
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
              <input defaultValue={busInfo.busNumber} name="bus_number" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input defaultValue={busInfo.startTime} name="start_time" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input defaultValue={busInfo.rounds} name="rounds" onChange={this.handleEditChange} type="text"/>
            </td>
            <td>
              <input defaultValue={busInfo.endTime} name="end_time" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input defaultValue={busInfo.daysActive} name="daysActive" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <input defaultValue={busInfo.gap} name="gap" onChange={this.handleEditChange} type="text" />
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
              <input defaultValue={busInfo.openingDuration} name="opening_duration" onChange={this.handleEditChange} type="text" />
            </td>
            <td></td>
            <td>
              <label className="editClosingDuration">Closing Duration</label>
              <br/>
              <input defaultValue={busInfo.closingDuration} name="closing_duration" onChange={this.handleEditChange} type="text" />
            </td>
            <td></td>
            <td>
              <label className="editGapDuration">Gap Duration</label>
              <br />
              <input defaultValue={busInfo.gapDuration} name="gapDuration" onChange={this.handleEditChange} type="text" />
            </td>
            <td>
              <button onClick={() => this.editBus(this.state.editBus)} type="submit" className="w-40 saveChangesBtn btn btn-success">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </td>
          </tr>
        </tbody>
      );
    }
  }
}
