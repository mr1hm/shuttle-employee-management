import React from 'react';
import TopMenuGeneral from '../components/topmenu/topmenu-general';
import './admin-operator-availability.css';
import AddUserModal from './admin-add-user-modal';
import EditUserModal from './admin-edit-user-modal';
import SelectSessionModal from './admin-select-session-modal';

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

  processSessionSelection(event) {
    event.preventDefault();
    this.setState({
      selectSession: false
    });
    this.getOperatorDetails();
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
    this.getOperatorDetails();
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
      availSubmissionDate: this.state.operatorDetails[index]['avail_end_date']
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
        }, () => {
          console.log('sessionChoices after fetch', JSON.stringify(this.state.sessionChoices));
        }
        );
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
        'avail_end_date': this.state.availSubmissionDate,
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
          <div>{this.state.SessionId}</div>
          <button type="button" className="btn btn-primary btn ml-3" onClick={this.showSelectSessionModal}>Select Session</button>
          <button type="button" className="btn btn-primary btn ml-3" onClick={this.showAddUserModal}>Add User</button>
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
              <th>Status</th>
              <th></th>
              <th>Special Route</th>
              <th></th>
              <th>Min Avail. Hrs</th>
              <th></th>
              <th>Avail. Submission Date</th>
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
                    <td className='pb-2'>{operator['uci_net_id']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['last_name']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['first_name']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['role']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['status']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['special_route_ok']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['min_avail_hours']}</td>
                    <td></td>
                    <td className='pb-2'>{operator['avail_end_date']}</td>
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
        <AddUserModal showAddUserModal={this.state.addUser}>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.addUserToDatabase}>
              <div className="mt-5 ml-2 mr-2 mb-2">
                <div>UCI-ID</div>
                <input type='text' className ='form-control' name="userId" value={this.state.userId} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>First Name</div>
                <input type='text' className ='form-control' name="firstName" value={this.state.firstName} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Last Name</div>
                <input type='text' className ='form-control' name="lastName" value={this.state.lastName} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Role</div>
                <select name="role" value={this.state.role} onChange={this.handleFormEntry}>
                  <option></option>
                  <option value='operator'>operator</option>
                  <option value='operations'>operations</option>
                  <option value='trainer'>trainer</option>
                  <option value='trainee'>trainer</option>
                </select>
              </div>
              <div className="m-2">
                <div>Status</div>
                <select name="status" value={this.state.status} onChange={this.handleFormEntry}>
                  <option></option>
                  <option value='active'>active</option>
                  <option value='inactive'>inactive</option>
                </select>
              </div>
              <div className="m-2">
                <div>Special Route OK</div>
                <select name="specialRouteOK" value={this.state.specialRouteOK} onChange={this.handleFormEntry}>
                  <option></option>
                  <option value='0'>0</option>
                  <option value='1'>1</option>
                </select>
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Submit</button>
                <button className="btn-danger ml-2" type='reset' onClick={this.closeAddUserModalClearInfo} >Cancel</button>
              </div>
            </form>
          </div>
        </AddUserModal>
        <EditUserModal showEditUserModal={this.state.editUser}>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.updateUserInDatabase}>
              <div className="mt-5 ml-2 mr-2 mb-2">
                <div>UCI-ID</div>
                <div>{this.state.userId}</div>
              </div>
              <div className="m-2">
                <div>First Name</div>
                <input type='text' name="firstName" defaultValue={this.state.firstName} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Last Name</div>
                <input type='text' name="lastName" defaultValue={this.state.lastName} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Role</div>
                <select name="role" defaultValue={this.state.role} onChange={this.handleFormEntry}>
                  <option value='operator'>operator</option>
                  <option value='operations'>operations</option>
                  <option value='trainer'>trainer</option>
                  <option value='trainee'>trainee</option>
                </select>
              </div>
              <div className="m-2">
                <div>Status</div>
                <select name="status" defaultValue={this.state.status} onChange={this.handleFormEntry}>
                  <option value='active'>active</option>
                  <option value='inactive'>inactive</option>
                </select>
              </div>
              <div className="m-2">
                <div>Special Route OK</div>
                <select name="specialRouteOK" defaultValue={this.state.specialRouteOK} onChange={this.handleFormEntry}>
                  <option value='0'>0</option>
                  <option value='1'>1</option>
                </select>
              </div>
              <div className="m-2">
                <div>Minimum Available Hours</div>
                <select name="minAvailHours" defaultValue={this.state.minAvailHours} onChange={this.handleFormEntry}>{hours.map(index => (<option key={index} value={'' + index}>{index}</option>))}
                </select>
              </div>
              <div className="m-2">
                <div>Availability Submission Date</div>
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
