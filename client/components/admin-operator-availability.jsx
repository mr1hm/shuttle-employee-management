import React from 'react';
import TopMenuGeneral from '../components/topmenu/topmenu-general';
import './admin-operator-availability.css';
import EditUserModal from './admin-edit-user-modal';
import SelectSessionModal from './admin-select-session-modal';
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
      availSubmissionDate: '',
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
    this.showAddUserModal = this.showAddUserModal.bind(this);
    this.showSelectSessionModal = this.showSelectSessionModal.bind(this);
    this.processSessionSelection = this.processSessionSelection.bind(this);
    this.closeSelectSessionModal = this.closeSelectSessionModal.bind(this);
    this.addUserToDatabase = this.addUserToDatabase.bind(this);
    this.updateUserInDatabase = this.updateUserInDatabase.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
    this.editUser = this.editUser.bind(this);
    this.closeAddUserModal = this.closeAddUserModal.bind(this);
    this.closeEditUserModal = this.closeEditUserModal.bind(this);
    this.closeEditUserModalClearInfo = this.closeEditUserModalClearInfo.bind(this);
    this.closeAddUserModalClearInfo = this.closeAddUserModalClearInfo.bind(this);
  }

  addUserToDatabase(event) {
    event.preventDefault();
    this.closeAddUserModal();
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'uci_net_id': this.state.userId,
        'last_name': this.state.lastName,
        'first_name': this.state.firstName,
        'role': this.state.role,
        'status': this.state.status,
        'special_route_ok': this.state.specialRouteOK
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch('/api/add-user.php', data)
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

  closeAddUserModal() {
    this.setState({
      addUser: false
    });
  }

  closeAddUserModalClearInfo() {
    this.closeAddUserModal();
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
        sessionName: event.nativeEvent.target[index].text
      });
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  processSessionSelection(event) {
    event.preventDefault();
    this.setState({
      selectSession: false
    });
    this.getOperatorDetails();
  }

  setDefaultSession() {
    var dateToday = new Date();
    var date = getDateString(dateToday);
    this.state.sessionChoices.forEach(element => {
      if (element.startDateString <= date && date <= element.endDateString) {
        this.setState({
          sessionId: element.id,
          sessionName: element.name
        }, this.getOperatorDetails);
      }
    });
  }

  showAddUserModal() {
    this.setState({
      addUser: true
    });
  }

  showSelectSessionModal() {
    this.setState({
      selectSession: true
    });
  }

  showEditUserModal() {
    this.setState({
      editUser: true
    });
  }

  showParameterModal() {
    this.setState({
      parameter: true
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
    if (!this.state.operatorDetails) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <div className='nav'>
          <TopMenuGeneral title="ADMIN-OPERATOR AVAILABILITY" />
        </div>
        <div className="addButton" style={{ fontWeight: 'bold', fontSize: '1.5em' }}>{this.state.sessionName}</div>
        <div className="addButton d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-primary btn ml-3" onClick={this.showSelectSessionModal}>Select Session</button>
        </div>
        <table className= 'mt-4'>
          <thead>
            <tr>
              <th>User Id</th>
              <th></th>
              <th >Last Name</th>
              <th></th>
              <th>First Name</th>
              <th></th>
              <th>Role</th>
              <th></th>
              <th>Special Route</th>
              <th></th>
              <th>Minimum Hrs</th>
              <th></th>
              <th>Submission Date</th>
              <th></th>
              <th>Submitted</th>
              <th></th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.operatorDetails.map((operator, index) => {
                return (
                  <tr key={index} className='pb-2'>
                    <td className='pb-2'>{operator.uci_net_id}</td>
                    <td></td>
                    <td className='pb-2'>{operator.last_name}</td>
                    <td></td>
                    <td className='pb-2'>{operator.first_name}</td>
                    <td></td>
                    <td className='pb-2'>{operator.role}</td>
                    <td></td>
                    <td className='pb-2'>{operator.special_route_ok}</td>
                    <td></td>
                    <td className='pb-2'>{operator.min_avail_hours}</td>
                    <td></td>
                    <td className='pb-2'>{operator.availEndDateString}</td>
                    <td></td>
                    <td className='pb-2'>{this.submittedStatus(operator)}</td>
                    <td></td>
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
                <div style={{ fontWeight: 'bold' }}>UCI-ID</div>
                <div>{this.state.userId}</div>
              </div>
              <div className="m-2">
                <div style={{ fontWeight: 'bold' }}>First Name</div>
                <div>{this.state.firstName}</div>
              </div>
              <div className="m-2">
                <div style={{ fontWeight: 'bold' }}>Last Name</div>
                <div>{this.state.lastName}</div>
              </div>
              <div className="m-2">
                <div style={{ fontWeight: 'bold' }}>Role</div>
                <div>{this.state.role}</div>
              </div>
              <div className="m-2">
                <div style={{ fontWeight: 'bold' }}>Minimum Available Hours</div>
                <select name="minAvailHours" defaultValue={this.state.minAvailHours} onChange={this.handleFormEntry}>
                  <option></option>
                  {hours.map(index => (<option key={index} value={'' + index}>{index}</option>))}
                </select>
              </div>
              <div className="m-2">
                <div style={{ fontWeight: 'bold' }}>Availability Submission Date</div>
                <input type='text' name="availSubmissionDate" defaultValue={this.state.availSubmissionDate} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Submit</button>
                <button className="btn-danger ml-2" type='reset' onClick={this.closeEditUserModalClearInfo} >Cancel</button>
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
      </React.Fragment>
    );
  }
}

export default AdminOperatorAvailability;
