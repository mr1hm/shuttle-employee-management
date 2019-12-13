import React from 'react';
import { Link } from 'react-router-dom';
import AddUserModal from './admin-add-user-modal';
import './admin-user-summary.scss';

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
      cellProviderList: [],
      active: true

    };
    this.getOperatorDetails = this.getOperatorDetails.bind(this);
    this.showAddUserModal = this.showAddUserModal.bind(this);
    this.addUserToDatabase = this.addUserToDatabase.bind(this);
    this.handleFormEntry = this.handleFormEntry.bind(this);
    this.closeAddUserModal = this.closeAddUserModal.bind(this);
    this.closeAddUserModalClearInfo = this.closeAddUserModalClearInfo.bind(this);
    this.showAllUsers = this.showAllUsers.bind(this);
    this.showActiveUsers = this.showActiveUsers.bind(this);
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
          cellProvider: '',
          active: ''
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
      phone: '',
      email: '',
      cellProvider: '',
      active: ''
    });
  }

  componentDidMount() {
    this.getOperatorDetails();
  }

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
        });
      })
      .catch(error => { throw (error); });
  }

  handleFormEntry(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  showActiveUsers() {
    this.setState({
      active: true
    });
  }

  showAddUserModal(event) {
    this.setState({
      addUser: true
    });
  }

  showAllUsers() {
    this.setState({
      active: false
    });
  }

  toggleActiveAndAllUsers() {
    if (this.state.active) {
      return (
        <button type="button" className="btn btn-primary btn ml-3" onClick={this.showAllUsers}>Show All Users</button>
      );
    } else {
      return (
        <button type="button" className="btn btn-primary btn ml-3" onClick={this.showActiveUsers}>Show Active Users</button>
      );
    }
  }

  render() {
    const tableHeaders = ['Last Name', 'First Name', 'User Id', 'Role', 'Status', 'Special Route', 'Phone', 'Email', 'Cell Provider', 'Actions'];

    if (!this.state.userDetails) {
      return <div>Loading</div>;
    }

    return (
      <React.Fragment>
        <div className="addButton d-flex justify-content-end mt-3">
          {this.toggleActiveAndAllUsers()}
          <button type="button" className="btn btn-primary btn ml-3" name="addUser" onClick={this.showAddUserModal}>Add User</button>
        </div>
        <table className= 'mt-4'>
          <thead>
            <tr>
              {tableHeaders.map((title, index) => (<th key={index}>{title}</th>))}
            </tr>
          </thead>
          <tbody>
            {
              this.state.userDetails.map((user, index) => {
                if (this.state.active) {
                  if (user['status'] === 'active') {
                    return (
                      <tr key={index} className='pb-2'>
                        <td className='pb-2'>{user.last_name}</td>
                        <td className='pb-2'>{user.first_name}</td>
                        <td className='pb-2'>{user.uci_net_id}</td>
                        <td className='pb-2'>{user.role}</td>
                        <td className='pb-2'>{user.status}</td>
                        <td className='pb-2'>{parseInt(user.special_route_ok) === 1 ? 'yes' : 'no'}</td>
                        <td className='pb-2'>{user.phone}</td>
                        <td className='pb-2'>{user.email}</td>
                        <td className='pb-2'>{user.cell_provider}</td>
                        <td className='pb-2'>
                          <Link className="btn btn-outline-primary" to={`/admin-edit-user/${user.uci_net_id}`}>Edit</Link>
                        </td>
                      </tr>
                    );
                  }
                } else {
                  return (
                    <tr key={index} className='pb-2'>
                      <td className='pb-2'>{user.last_name}</td>
                      <td className='pb-2'>{user.first_name}</td>
                      <td className='pb-2'>{user.uci_net_id}</td>
                      <td className='pb-2'>{user.role}</td>
                      <td className='pb-2'>{user.status}</td>
                      <td className='pb-2'>{parseInt(user.special_route_ok) === 1 ? 'yes' : 'no'}</td>
                      <td className='pb-2'>{user.phone}</td>
                      <td className='pb-2'>{user.email}</td>
                      <td className='pb-2'>{user.cell_provider}</td>
                      <td className='pb-2'>
                        <Link to="/myinfo/" id={parseInt(user.id)}><input value="change" type='button'/> </Link>
                      </td>
                    </tr>
                  );
                }
              })
            }
          </tbody>
        </table>

        <AddUserModal open={this.state.addUser}/>
      </React.Fragment>
    );
  }
}

export default AdminUserSummary;
