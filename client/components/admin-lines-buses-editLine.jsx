import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCaretUp, faBus, faCaretDown, faWindowClose, faEdit, faTrash, faBan, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default class EditLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editLine: {
        lineID: this.props.line.real_route_id,
        session_id: this.props.line.sessionID,
        roundDuration: this.props.line.roundDuration,
        line_name: this.props.line.line_name,
        status: this.props.line.status,
        public: this.props.line.public,
        regularService: this.props.line.regularService,
        specialDriver: this.props.line.specialDriver === 'True' ? 1 : 0
      },
      editLineSent: false
    };
    this.handleEditLineChange = this.handleEditLineChange.bind(this);
    this.handleSpecialDriverChange = this.handleSpecialDriverChange.bind(this);
  }

  handleSpecialDriverChange(e) {
    const checked = e.target.checked;
    if (checked) {
      this.setState(prevState => ({
        editLine: {
          ...prevState.editLine,
          specialDriver: 1
        }
      }));
    } else {
      this.setState(prevState => ({
        editLine: {
          ...prevState.editLine,
          specialDriver: 0
        }
      }));
    }
  }

  handleEditLineChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => ({
      editLine: {
        ...prevState.editLine,
        [name]: value
      }
    }));
  }

  editLine(line) {
    const init = {
      method: 'POST',
      body: JSON.stringify(line)
    };
    fetch(`api/admin-lines-buses.php`, init)
      .then(response => response.json())
      .then(lineInfo => {
        console.log(line.session_id);
        this.setState({
          editLineSent: !this.state.editLineSent
        }, () => {
          if (this.props.currentSession === 'All Sessions') {
            this.props.getLinesBusesInfo();
          } else {
            this.props.getLinesBusesInfo({ session_id: line.session_id });
          }
          this.props.handleEditLineClicked();
        });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { line } = this.props;
    return (
      <div id="accordion">
        <div className="card" id={line.real_route_id}>
          <div className="card-header lineCardHeader" id={'heading' + line.line_name}>
            <div className="row align-items-center editLineHeaderRow">
              <div className={`col ${line.line_name}`}>
                Line Name
              </div>
              <div className="col">
                Status
              </div>
              <div className="col">
                Round Duration
              </div>
              <div className="col">
                Public
              </div>
              <div className="col">
                Regular Service
              </div>
              <div className="col">
                <label className="form-check-label" htmlFor="specialDriverCheckbox">
                  Special Driver
                </label>
                {this.state.editLine.specialDriver === 1
                  ? <input type="checkbox" onChange={this.handleSpecialDriverChange} name="specialDriver" className="editSpecialDriverCheckbox ml-1" id="specialDriverCheckbox" defaultChecked={true} />
                  : <input type="checkbox" onChange={this.handleSpecialDriverChange} name="specialDriver" className="editSpecialDriverCheckbox ml-1" id="specialDriverCheckbox" />}
              </div>
              <div className="col d-flex justify-content-center">
                {!this.props.editLineClicked ? <button onClick={this.props.handleEditLineClicked} className="editLineBtn btn btn-warning"><FontAwesomeIcon className="ml-1" icon={faEdit} /></button>
                  : <button onClick={this.props.handleEditLineClicked} className="cancelEditLineBtn btn btn-warning"><FontAwesomeIcon icon={faBan} /></button>
                }
              </div>
            </div>
            <div className="row editLineInputRow align-items-center">
              <div className="col">
                <input name="line_name" className="col border border-primary" defaultValue={line.line_name} type="text" onChange={this.handleEditLineChange} />
              </div>
              <div className="col">
                <select name="status" className="col border border-primary" defaultValue={line.status} type="text" onChange={this.handleEditLineChange}>
                  <option>active</option>
                  <option>inactive</option>
                </select>
              </div>
              <div className="col">
                <input name="roundDuration" className="col border border-primary" type="text" defaultValue={line.roundDuration} onChange={this.handleEditLineChange} />
              </div>
              <div className="col">
                <select name="public" className="col border border-primary" type="text" defaultValue={line.public} onChange={this.handleEditLineChange}>
                  <option>True</option>
                  <option>False</option>
                </select>
              </div>
              <div className="col">
                <select name="regularService" className="col border border-primary" type="text" defaultValue={line.regularService} onChange={this.handleEditLineChange}>
                  <option>True</option>
                  <option>False</option>
                </select>
              </div>
              <div className="col">
                <button className="btn btn-link" type="button" data-toggle="collapse"
                  name={`busDetailsClicked${line.route_id}`} href={'#collapse' + line.line_name} onClick={this.props.displayBusDetails} aria-expanded="true" aria-controls={'collapse' + line.line_name}>
                  Bus Details
                  {this.props.busDetailsClicked ? <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretUp} /> : <FontAwesomeIcon className="busDetailsIcon ml-1" icon={faCaretDown} />}
                </button>
              </div>
              <div className="col d-flex justify-content-center">
                {this.props.editLineClicked ? <button className="editLineSubmitBtn btn btn-success" onClick={() => this.editLine(this.state.editLine)}><FontAwesomeIcon icon={faPaperPlane} /></button> : <button onClick={() => this.props.deleteLine(line.real_route_id)} className="btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
