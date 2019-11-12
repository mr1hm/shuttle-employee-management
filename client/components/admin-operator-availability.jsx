import React from 'react';
import TopMenuGeneral from '../components/topmenu/topmenu-general';
import './admin-operator-availability.css';
import AddUserModal from './admin-add-user-modal';

class AdminOperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      lastName: '',
      firstName: '',
      role: null,
      status: null,
      specialRouteOK: null,
      addUser: false,
      operatorDetails: null,
      sessionId: 1
    };
    this.getOperatorDetails = this.getOperatorDetails.bind(this);
    this.showAddUserModal = this.showAddUserModal.bind(this);
    this.addUserToDatabase = this.addUserToDatabase.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
  }

  componentDidMount() {
    this.getOperatorDetails();
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

  showAddUserModal() {
    this.setState({
      addUser: true
    });
  }

  closeAddUserModal() {
    this.setState({
      addUser: false
    });
  }

  handleFormEntry(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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
      })
      .catch(error => { throw (error); });
  }

  handleClickUnassignOperator() {
    let rounds = this.state.roundsToUnassign;
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'user_id': 1,
        'rounds': rounds
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-update-shifts.php`, data)
      .then(response => { })
      .then(data => {
        this.getTodaysShiftData(this.state.date);
        this.setState({
          availableOperators: [],
          roundsSelected: [],
          selectingUnassign: false,
          shiftsSelected: [],
          roundTimes: []
        });
      })
      .catch(error => { throw (error); });
  }

  render() {
    if (!this.state.operatorDetails) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <div className='nav'>
          <TopMenuGeneral title="ADMIN-OPERATOR AVAILABILITY" />
        </div>
        <div className="addButton d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-primary btn" onClick={this.showAddUserModal}>Add User</button>
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
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.operatorDetails.map((operator, index) => {
                return (
                  <tr key={index}>
                    <td>{operator['uci_net_id']}</td>
                    <td></td>
                    <td>{operator['last_name']}</td>
                    <td></td>
                    <td>{operator['first_name']}</td>
                    <td></td>
                    <td>{this.submittedStatus(operator)}</td>
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
                <input type='text' className = 'form-control' name="userId" placeholder="User ID" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <input type='text' className = 'form-control' name="lastName" placeholder="Last Name" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <input type='text' className = 'form-control' name="firstName" placeholder="First Name" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <input type='text' className = 'form-control' name="role" placeholder="Role" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <input type='text' className = 'form-control' name="status" placeholder="Status" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <input type='text' className = 'form-control' name="specialRouteOK" placeholder="Special Route Auth" onChange={this.handleFormEntry} />
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-primary" type='submit'>Submit</button>
              </div>
            </form>
          </div>
        </AddUserModal>
      </React.Fragment>
    );
  }
}

export default AdminOperatorAvailability;
