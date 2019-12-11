import React from 'react';
import './admin-operator-availability.css';
import EditUserModal from './admin-edit-user-modal';
import SelectSessionModal from './admin-select-session-modal';
import ChangeDateModal from './admin-change-date-modal';
import ChangeHoursModal from './admin-change-hours-modal';
import { getDateString } from '../lib/time-functions';

class AdminOperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      lastName: '',
      firstName: '',
      role: '',
      status: '',
      specialRouteOK: '',
      minAvailHours: '',
      minOperatorHours: '',
      minOperationsHours: '',
      minTrainerHours: '',
      minTraineeHours: '',
      availSubmissionDate: '',
      startDate: '',
      endDate: '',
      changeDate: false,
      changeHours: false,
      addUser: false,
      editUser: false,
      selectSession: false,
      operatorDetails: null,
      parameter: false,
      sessionId: '',
      sessionChoices: [],
      sessionName: ''

    };
    this.getOperatorDetails = this.getOperatorDetails.bind(this);
    this.getSessions = this.getSessions.bind(this);
    this.showSelectSessionModal = this.showSelectSessionModal.bind(this);
    this.processSessionSelection = this.processSessionSelection.bind(this);
    this.closeSelectSessionModal = this.closeSelectSessionModal.bind(this);
    this.updateUserInDatabase = this.updateUserInDatabase.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
    this.editUser = this.editUser.bind(this);
    this.closeEditUserModal = this.closeEditUserModal.bind(this);
    this.closeEditUserModalClearInfo = this.closeEditUserModalClearInfo.bind(this);
    this.showChangeDatesModal = this.showChangeDatesModal.bind(this);
    this.updateDateChangesInDatabase = this.updateDateChangesInDatabase.bind(this);
    this.closeChangeHoursModal = this.closeChangeHoursModal.bind(this);
    this.closeChangeHoursModal = this.closeChangeHoursModal.bind(this);
    this.showChangeHoursModal = this.showChangeHoursModal.bind(this);
    this.updateHoursInDatabase = this.updateHoursInDatabase.bind(this);

  }

  closeChangeDateModal() {
    this.setState({
      changeDate: false
    });
  }
  closeChangeHoursModal() {
    this.setState({
      changeHours: false
    });
  }
  closeSelectSessionModal() {
    this.setState({
      selectSession: false
    });
  }

  closeEditUserModal() {
    this.setState({
      editUser: false
    });
    this.getOperatorDetails();
  }

  closeEditUserModalClearInfo() {
    this.closeEditUserModal();
    this.setState({
      userId: '',
      lastName: '',
      firstName: '',
      role: '',
      status: '',
      specialRouteOK: '',
      minAvailHours: '',
      availSubmissionDate: ''
    });
  }

  componentDidMount() {
    this.getSessions();
  }

  editUser(event) {
    const index = event.currentTarget.id;
    this.setState({
      userId: this.state.operatorDetails[index]['uci_net_id'],
      lastName: this.state.operatorDetails[index]['last_name'],
      firstName: this.state.operatorDetails[index]['first_name'],
      role: this.state.operatorDetails[index]['role'],
      status: this.state.operatorDetails[index]['status'],
      specialRouteOK: this.state.operatorDetails[index]['special_route_ok'],
      minAvailHours: this.state.operatorDetails[index]['min_avail_hours'],
      availSubmissionDate: this.state.operatorDetails[index]['availEndDateString']
    });
    this.showEditUserModal();
  }

  getOperatorDetails() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-operator-availability.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          operatorDetails: data
        });
      })
      .catch(error => { throw (error); });
  }

  getSessions() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/sessions.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          sessionChoices: data
        }, this.setDefaultSession);
      })
      .catch(error => { throw (error); });
  }

  handleFormEntry(event) {
    if (event.target.name === 'sessionId') {
      var index = event.nativeEvent.target.selectedIndex;
      this.setState({
        sessionName: event.nativeEvent.target[index].text,
        sessionId: event.target.value
      }, this.setOtherSessionProperties);
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  processSessionSelection(event) {
    event.preventDefault();
    this.setState({
      selectSession: false
    }, this.setOtherSessionProperties);
  }

  setDefaultSession() {
    var dateToday = new Date();
    var date = getDateString(dateToday);
    this.state.sessionChoices.forEach(element => {
      if (element.startDateString <= date && date <= element.endDateString) {
        this.setState({
          sessionId: element.id,
          sessionName: element.name
        }, this.setOtherSessionProperties);
      }
    });
  }

  setOtherSessionProperties() {
    for (var index = 0; index < this.state.sessionChoices.length; index++) {
      if (this.state.sessionChoices[index].id === this.state.sessionId) {
        var minOperatorHrs = this.state.sessionChoices[index].min_operator_hours;
        var minOperationsHrs = this.state.sessionChoices[index].min_operations_hours;
        var minTraineeHrs = this.state.sessionChoices[index].min_trainee_hours;
        var minTrainerHrs = this.state.sessionChoices[index].min_trainer_hours;
        var availStartDate = this.state.sessionChoices[index].availStartDateString;
        var availEndDate = this.state.sessionChoices[index].availEndDateString;
      }
    }
    this.setState({
      minOperatorHours: minOperatorHrs,
      minOperationsHours: minOperationsHrs,
      minTrainerHours: minTrainerHrs,
      minTraineeHours: minTraineeHrs,
      startDate: availStartDate,
      endDate: availEndDate
    }, this.getOperatorDetails);
  }

  showChangeHoursModal() {
    this.setState({
      changeHours: true
    });
  }

  showSelectSessionModal() {
    this.setState({
      selectSession: true
    });
  }

  showChangeDatesModal() {
    this.setState({
      changeDate: true
    });
  }

  showEditUserModal() {
    this.setState({
      editUser: true
    });
  }

  submittedStatus(operator) {
    const defaultStyles = {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      margin: '0 auto'
    };

    const colorStyle = {
      backgroundColor: undefined
    };

    (operator['submitted']) ? colorStyle.backgroundColor = 'green' : colorStyle.backgroundColor = 'red';

    return (
      <div style={{ ...defaultStyles, ...colorStyle }}></div>
    );
  }

  updateHoursInDatabase(event) {
    event.preventDefault();
    this.closeChangeHoursModal();
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'min_operator_hours': this.state.minOperatorHours,
        'min_operations_hours': this.state.minOperationsHours,
        'min_trainer_hours': this.state.minTrainerHours,
        'min_trainee_hours': this.state.minTraineeHours,
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/edit-minimum-hours.php', data)
      .catch(error => { throw (error); });
  }

  updateDateChangesInDatabase(event) {
    event.preventDefault();
    this.closeChangeDateModal();
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'avail_start_date': this.state.startDate,
        'avail_end_date': this.state.endDate,
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/edit-availability-dates.php', data)
      .catch(error => { throw (error); });
  }

  updateUserInDatabase(event) {
    event.preventDefault();
    this.closeEditUserModal();
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'uci_net_id': this.state.userId,
        'last_name': this.state.lastName,
        'first_name': this.state.firstName,
        'role': this.state.role,
        'status': this.state.status,
        'special_route_ok': this.state.specialRouteOK,
        'min_avail_hours': this.state.minAvailHours,
        'availEndDateString': this.state.availSubmissionDate,
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/edit-user.php', data)
      .then(response => { })
      .then(data => {
        this.getOperatorDetails();
        this.setState({
          userId: '',
          lastName: '',
          firstName: '',
          role: '',
          status: '',
          specialRouteOK: '',
          minAvailHours: '',
          availSubmissionDate: ''
        });
      })
      .catch(error => { throw (error); });
  }

  render() {
    var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    var tableheaderContent = ['Last Name', 'First Name', 'User Id', 'Role', 'Special Route', 'Minimum Hrs', 'Submission Date', 'Submitted', 'Change'];

    if (!this.state.operatorDetails) {
      return <div>Loading</div>;
    }

    return (
      <React.Fragment>
        <div className="addButton d-flex justify-content-end mt-3">
          <button className="btn-sm btn-primary ml-3" onClick={this.showSelectSessionModal}>Select Session</button>
        </div>
        <div className="addButton d-flex justify-content-start">
          <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>{this.state.sessionName}</div>
        </div>
        <div className="addButton d-flex justify-content-start mt-2" style={{ backgroundColor: 'lightgray' }}>
          <div className="mr-2 d-flex justify-content-center pr-3 pl-3 mt-3">
            <div>
              <div className="mr-3">Min Operator Hours: {this.state.minOperatorHours}</div>
              <div>Min Operations Hours: {this.state.minOperationsHours}</div>
              <div className="mr-4">Min Trainer Hours: {this.state.minTrainerHours}</div>
              <div >Min Trainee Hours: {this.state.minTraineeHours}</div>
              <button className="btn-secondary btn-block mt-2" onClick={this.showChangeHoursModal}>Change Minimum Hours</button>
            </div>
          </div>
          <div className="d-flex justify-content-center pt-5 pr-3 pl-3 pb-3 mt-3">
            <div >
              <div>Open Date: {this.state.startDate} </div>
              <div>Close Date: {this.state.endDate} </div>
              <button className="btn-secondary btn-block mt-2" onClick={this.showChangeDatesModal}>Change Dates</button>
            </div>
          </div>

        </div>

        <table className= 'mt-4'>
          <thead>
            <tr>
              {tableheaderContent.map((title, index) => (<th key={index}>{title}</th>))}
            </tr>
          </thead>
          <tbody>
            {
              this.state.operatorDetails.map((operator, index) => {
                return (
                  <tr key={index} className='pb-2'>
                    <td className='pb-2'>{operator.last_name}</td>
                    <td className='pb-2'>{operator.first_name}</td>
                    <td className='pb-2'>{operator.uci_net_id}</td>
                    <td className='pb-2'>{operator.role}</td>
                    <td className='pb-2'>{operator.special_route_ok === '1' ? 'yes' : 'no'}</td>
                    <td className='pb-2'>{operator.min_avail_hours}</td>
                    <td className='pb-2'>{operator.availEndDateString}</td>
                    <td className='pb-2'>{this.submittedStatus(operator)}</td>
                    <td className='pb-2'>
                      <input onClick={this.editUser} id ={index} value="change" type='button'/>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        <EditUserModal showEditUserModal={this.state.editUser}>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.updateUserInDatabase}>
              <div className="mt-5 ml-2 mr-2 mb-2">
                <div className="editTitle">UCI-ID</div>
                <div>{this.state.userId}</div>
              </div>
              <div className="m-2">
                <div className="editTitle">First Name</div>
                <div>{this.state.firstName}</div>
              </div>
              <div className="m-2">
                <div className="editTitle">Last Name</div>
                <div>{this.state.lastName}</div>
              </div>
              <div className="m-2">
                <div className="editTitle">Role</div>
                <div>{this.state.role}</div>
              </div>
              <div className="m-2">
                <div className="editTitle">Minimum Available Hours</div>
                <select name="minAvailHours" defaultValue={this.state.minAvailHours} onChange={this.handleFormEntry}>
                  <option></option>
                  {hours.map(index => (<option key={index} value={'' + index}>{index}</option>))}
                </select>
              </div>
              <div className="m-2">
                <div className="editTitle">Availability Submission Date</div>
                <input type='text' name="availSubmissionDate" defaultValue={this.state.availSubmissionDate} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Submit</button>
                <button className="btn-danger ml-2" type='reset' onClick={this.closeEditUserModalClearInfo}>Cancel</button>
              </div>
            </form>
          </div>
        </EditUserModal>

        <SelectSessionModal showSelectSessionModal={this.state.selectSession}>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.processSessionSelection}>
              <div className="m-2">
                <div>Select Session to Display</div>
                <select name="sessionId" onChange={this.handleFormEntry} defaultValue={this.state.sessionName}>
                  <option></option>
                  {this.state.sessionChoices.map((session, index) => (<option key={index} value={session['id']}>{session['name']}</option>))}
                </select>
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Submit</button>
                <button className="btn-danger ml-2" type='reset' onClick={this.closeSelectSessionModal} >Cancel</button>
              </div>
            </form>
          </div>
        </SelectSessionModal>

        <ChangeDateModal showChangeDateModal={this.state.changeDate}>
          <div className="d-flex justify-content-center">
            <div>{this.state.sessionName}</div>
            <form onSubmit={this.updateDateChangesInDatabase}>
              <div className="m-2">
                <div>Availability Start Date</div>
                <input name="startDate" onChange={this.handleFormEntry} value={this.state.startDate}/>
              </div>
              <div className="m-2">
                <div>Availability End Date</div>
                <input name="endDate" onChange={this.handleFormEntry} value={this.state.endDate}/>
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Close</button>
              </div>
            </form>
          </div>
        </ChangeDateModal>

        <ChangeHoursModal showChangeHoursModal={this.state.changeHours}>
          <div className="d-flex justify-content-center">
            <div>{this.state.sessionName}</div>
            <form onSubmit={this.updateHoursInDatabase}>
              <div className="m-2">
                <div>Minimum Operator Hours</div>
                <input name="minOperatorHours" onChange={this.handleFormEntry} value={this.state.minOperatorHours}/>
              </div>
              <div className="m-2">
                <div>Minimum Operations Hours</div>
                <input name="minOperationsHours" onChange={this.handleFormEntry} value={this.state.minOperationsHours}/>
              </div>
              <div className="m-2">
                <div>Minimum Trainer Hours</div>
                <input name="minTrainerHours" onChange={this.handleFormEntry} value={this.state.minTrainerHours}/>
              </div>
              <div className="m-2">
                <div>Minimum Trainee Hours</div>
                <input name="minTraineeHours" onChange={this.handleFormEntry} value={this.state.minTraineeHours}/>
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Close</button>
              </div>
            </form>
          </div>
        </ChangeHoursModal>

      </React.Fragment>
    );
  }
}

export default AdminOperatorAvailability;
