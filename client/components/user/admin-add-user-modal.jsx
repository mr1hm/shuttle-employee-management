import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { adminAddUser, adminGetUserRoles } from '../../actions';

class AddUserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addError: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'default',
      special: '0',
      status: 'active',
      uciNetId: ''
    };

    this.emailDomain = '@uci.edu';
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  componentDidMount() {
    this.genPassword();
    this.props.adminGetUserRoles();
  }

  closeModal() {
    this.setState({
      addError: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'default',
      special: '0',
      status: 'active',
      uciNetId: ''
    });

    this.genPassword();

    this.props.close();
  }

  inputChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  genPassword() {
    const password = 'password1';

    this.setState({ password });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formValues = { ...this.state, email: this.state.uciNetId + this.emailDomain };

    try {
      const userUciNetId = await this.props.adminAddUser(formValues);

      this.props.history.push(`/admin-edit-user/${userUciNetId}`);
    } catch (error) {
      this.setState({
        addError: 'Error creating user, check form for missing fields'
      });
    }
  }

  render() {
    const { open, roles } = this.props;

    if (!open) {
      return null;
    }

    const { addError, firstName, lastName, role, password, special, status, uciNetId } = this.state;

    return (
      <div className="add-user-modal">
        <div className="add-user-modal-content">
          <form className="p-4" onSubmit={this.handleSubmit}>
            <h3>Add New User</h3>
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="uciNetId">UCI Net ID</label>
                  <input className="form-control" type="text" id="uciNetId" name="uciNetId" value={uciNetId} onChange={this.inputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input className="form-control" type="text" id="firstName" name="firstName" value={firstName} onChange={this.inputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input className="form-control" type="text" id="lastName" name="lastName" value={lastName} onChange={this.inputChange} />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input className="form-control" type="email" id="email" value={uciNetId + this.emailDomain} readOnly />
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input className="form-control" type="text" id="password" name="password" value={password} onChange={this.inputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="roles">User Role</label>
                  <select className="form-control" id="roles" name="role" value={role} onChange={this.inputChange}>
                    <option value="default" disabled>Select a role</option>
                    { roles.map(({ displayName, id }) => <option key={id} value={id}>{displayName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">User Status</label>
                  <select className="form-control" id="status" name="status" value={status} onChange={this.inputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="special">Special Routes Okay?</label>
                  <select className="form-control" id="special" name="special" value={special} onChange={this.inputChange}>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center py-3">
              <button className="btn btn-danger mr-3" onClick={this.closeModal} type="button">Cancel</button>
              <button className="btn btn-success">Add User</button>
            </div>
            <p className="text-center text-danger">{addError}</p>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ admin: { roles, rolesMap } }) {
  return { roles, rolesMap };
}

export default connect(mapStateToProps, {
  adminAddUser,
  adminGetUserRoles
})(withRouter(AddUserModal));
