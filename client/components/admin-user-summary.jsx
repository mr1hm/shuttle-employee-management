import React from 'react';
import TopMenuGeneral from '../components/topmenu/topmenu-general';
import './admin-operator-availability.css';
import AddUserModal from './admin-add-user-modal';

class AdminUserSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      lastName: '',
      firstName: '',
      role: '',
      status: '',
      specialRouteOK: '',
      phone: '',
      email: '',
      cellProvider: '',
      addUser: false,
      editUser: false,
      userDetails: [],
      sessionName: ''

    };
    this.getOperatorDetails = this.getOperatorDetails.bind(this);
    this.showAddUserModal = this.showAddUserModal.bind(this);
    this.addUserToDatabase = this.addUserToDatabase.bind(this);
    // this.updateUserInDatabase = this.updateUserInDatabase.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
    // this.editUser = this.editUser.bind(this);
    this.closeAddUserModal = this.closeAddUserModal.bind(this);
    // this.closeEditUserModal = this.closeEditUserModal.bind(this);
    // this.closeEditUserModalClearInfo = this.closeEditUserModalClearInfo.bind(this);
    // this.closeAddUserModalClearInfo = this.closeAddUserModalClearInfo.bind(this);
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
        'special_route_ok': this.state.specialRouteOK,
        'phone': this.state.phone,
        'email': this.state.email,
        'cell_provider': this.state.cellProvider
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
          phone: '',
          email: '',
          cellProvider: ''
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

  // closeEditUserModal() {
  //   this.setState({
  //     editUser: false
  //   });
  //   this.getOperatorDetails();
  // }

  // closeEditUserModalClearInfo() {
  //   this.closeEditUserModal();
  //   this.setState({
  //     userId: '',
  //     lastName: '',
  //     firstName: '',
  //     role: '',
  //     status: '',
  //     specialRouteOK: '',
  //     minAvailHours: '',
  //     availSubmissionDate: ''
  //   });
  // }

  componentDidMount() {
    this.getOperatorDetails();
  }

  // editUser(event) {
  //   const index = event.currentTarget.id;
  //   this.setState({
  //     userId: this.state.operatorDetails[index]['uci_net_id'],
  //     lastName: this.state.operatorDetails[index]['last_name'],
  //     firstName: this.state.operatorDetails[index]['first_name'],
  //     role: this.state.operatorDetails[index]['role'],
  //     status: this.state.operatorDetails[index]['status'],
  //     specialRouteOK: this.state.operatorDetails[index]['special_route_ok'],
  //     minAvailHours: this.state.operatorDetails[index]['min_avail_hours'],
  //     availSubmissionDate: this.state.operatorDetails[index]['avail_end_date']
  //   });
  //   this.showEditUserModal();
  // }

  getOperatorDetails() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-user-summary.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          userDetails: data
        }, () => {
          console.log('userDetails', JSON.stringify(this.state.userDetails));
        }
        );
      })
      .catch(error => { throw (error); });
  }

  handleFormEntry(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  showAddUserModal() {
    this.setState({
      addUser: true
    });
  }

  showEditUserModal() {
    this.setState({
      editUser: true
    });
  }

  // updateUserInDatabase(event) {
  //   event.preventDefault();
  //   this.closeEditUserModal();
  //   const data = {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       'uci_net_id': this.state.userId,
  //       'last_name': this.state.lastName,
  //       'first_name': this.state.firstName,
  //       'role': this.state.role,
  //       'status': this.state.status,
  //       'special_route_ok': this.state.specialRouteOK,
  //       'min_avail_hours': this.state.minAvailHours,
  //       'avail_end_date': this.state.availSubmissionDate,
  //       'session_id': this.state.sessionId
  //     }),
  //     headers: { 'Content-Type': 'application/json' }
  //   };
  //   fetch('/api/edit-user.php', data)
  //     .then(response => { })
  //     .then(data => {
  //       this.getOperatorDetails();
  //       this.setState({
  //         userId: '',
  //         lastName: '',
  //         firstName: '',
  //         role: '',
  //         status: '',
  //         specialRouteOK: '',
  //         minAvailHours: '',
  //         availSubmissionDate: ''
  //       });
  //     })
  //     .catch(error => { throw (error); });
  // }

  render() {
    if (!this.state.userDetails) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <div className='nav'>
          <TopMenuGeneral title="ADMIN-USER SUMMARY" />
        </div>
        <div className="addButton d-flex justify-content-end mt-3">
          {/* <button type="button" className="btn btn-primary btn ml-3" onClick={this.showSelectSessionModal}>Show All Users</button> */}
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
              <th>Phone</th>
              <th></th>
              <th>Email</th>
              <th></th>
              <th>Cell Provider</th>
              <th></th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.userDetails.map((user, index) => {
                return (
                  <tr key={index} className='pb-2'>
                    <td className='pb-2'>{user['uci_net_id']}</td>
                    <td></td>
                    <td className='pb-2'>{user['last_name']}</td>
                    <td></td>
                    <td className='pb-2'>{user['first_name']}</td>
                    <td></td>
                    <td className='pb-2'>{user['role']}</td>
                    <td></td>
                    <td className='pb-2'>{user['status']}</td>
                    <td></td>
                    <td className='pb-2'>{user['special_route_ok']}</td>
                    <td></td>
                    <td className='pb-2'>{user['phone']}</td>
                    <td></td>
                    <td className='pb-2'>{user['email']}</td>
                    <td></td>
                    <td className='pb-2'>{user['cell_provider']}</td>
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
              <div className="m-2">
                <div>Phone</div>
                <input type='text' className ='form-control' name="phone" value={this.state.phone} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Email</div>
                <input type='text' className ='form-control' name="email" value={this.state.email} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="m-2">
                <div>Cell Provider</div>
                <input type='text' className ='form-control' name="cellProvider" value={this.state.email} contentEditable="true" onChange={this.handleFormEntry} />
              </div>
              <div className="mt-4 mr-2 ml-2 mb-5 d-flex justify-content-center">
                <button className="btn-success mr-2" type='submit'>Submit</button>
                <button className="btn-danger ml-2" type='reset' onClick={this.closeAddUserModalClearInfo} >Cancel</button>
              </div>
            </form>
          </div>
        </AddUserModal>
      </React.Fragment>
    );
  }
}

export default AdminUserSummary;
