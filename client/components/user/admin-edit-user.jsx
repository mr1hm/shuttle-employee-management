import React from 'react';
import { connect } from 'react-redux';
import equal from 'deep-is';
import { adminGetUserData, adminSetUserRole, adminUpdateUser, getCellProviders, getShirtSizes } from '../../actions';
import { rolesList } from '../../config/permissions';
import { defaultProfileImage } from '../../config/profile';
import Editable from './editable-field';
import './admin-edit-user.scss';

class AdminUserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cellProvider: '',
      edit: false,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      shirtSize: '',
      uciNetId: '',
      errors: {}
    };

    this.resetForm = this.resetForm.bind(this);
    this.FormControls = this.FormControls.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.Permissions = this.Permissions.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    const { adminGetUserData, getCellProviders, getShirtSizes, match: { params } } = this.props;

    adminGetUserData(params.uciId);
    getCellProviders();
    getShirtSizes();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.user, prevProps.user)) {
      this.updateStateFromProps();
    }
  }

  buildOptions(data, key) {
    if (!data) {
      return [<option key="default" disabled>Loading Options...</option>];
    }

    return data.map(({ id, [key]: name }) => {
      return <option key={id} value={id}>{name}</option>;
    });
  }

  updateUserRole(role) {
    const { adminSetUserRole, user: { uciNetId } } = this.props;

    adminSetUserRole(role, uciNetId);
  }

  Permissions() {
    const { loggedInUsersRoles, user: { roles } } = this.props;
    const isLoggedInUserSuperAdmin = loggedInUsersRoles.includes('super_admin');

    const roleItems = rolesList.map(({ mid, name, requireSuperAdmin = false }) => {
      const value = roles ? roles.includes(mid) : false;
      let className = '';
      let onClick = this.updateUserRole.bind(this, mid);

      if (!isLoggedInUserSuperAdmin && requireSuperAdmin) {
        className = 'disabled';
        onClick = null;
      }

      return (
        <li key={mid} className={`list-group-item user-roles ${className}`} onClick={onClick}>
          <div onClick={e => e.preventDefault()}>
            <input type="checkbox" checked={value} readOnly />
            <label className="ml-3">{name}</label>
          </div>
        </li>
      );
    });

    return (
      <ul className="list-group">
        {roleItems}
      </ul>
    );
  }

  resetForm() {
    this.updateStateFromProps();

    this.setState({
      edit: false
    });
  }

  async saveChanges(e) {
    e.preventDefault();
    this.setState({ errors: {} });
    const { edit, errors, ...formValues } = this.state;
    const { adminUpdateUser, user } = this.props;

    if (formValues.phone) {
      const phone = formValues.phone.toString().replace(/\D/g, '');

      if (phone.length !== 10) {
        this.setState({
          errors: {
            phone: 'Invalid Phone Number'
          }
        });
        return;
      }

      formValues.phone = phone;
    }

    formValues.originalUciNetId = user.uciNetId;

    await adminUpdateUser(formValues);

    this.resetForm();
  }

  FormControls() {
    const { edit } = this.state;

    if (edit) {
      return (
        <div className="d-flex justify-content-center">
          <button onClick={this.resetForm} type="button" className="btn-sm btn-danger mr-3">Cancel Changes</button>
          <button className="btn-sm btn-success">Save Changes</button>
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-center">
        <button onClick={this.handleEditButton} type="button" className="btn-sm btn-primary">Edit Info</button>
      </div>
    );
  }

  handleEditButton() {
    this.setState({
      edit: !this.state.edit
    });
  }

  inputChange({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }

  updateStateFromProps() {
    const { cellProvider, email, firstName, lastName, phone, shirtSize, uciNetId } = this.props.user;

    this.setState({
      cellProvider,
      email,
      firstName,
      lastName,
      phone,
      shirtSize,
      uciNetId
    });
  }

  EditUsersName({ edit, firstName, lastName, onChange }) {
    if (!edit) return null;

    return (
      <>
        <div className="row mb-3">
          <div className="col-6">
            <strong>First Name:</strong>
          </div>
          <Editable className="col-6" edit={edit} name="firstName" value={firstName} onChange={onChange}/>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <strong>Last Name:</strong>
          </div>
          <Editable className="col-6" edit={edit} name="lastName" value={lastName} onChange={onChange}/>
        </div>
      </>
    );
  }

  render() {
    const { user, cellProviders, cellProvidersMap, shirtSizes, shirtSizesMap } = this.props;
    const { edit, uciNetId } = this.state;

    if (!uciNetId) return <p>Loading...</p>;

    const { url } = user;
    const { cellProvider, email, errors, firstName, lastName, phone, shirtSize } = this.state;

    return (
      <div className="admin-edit-user container">
        <h1 className="text-center my-3">Admin - Edit User</h1>
        <form className="row" onSubmit={this.saveChanges}>
          <div className="col-4">
            <h3>{`${firstName} ${lastName}`}</h3>
            <div className="pr-3">
              <img className="img-fluid" src={url || defaultProfileImage} />
            </div>
          </div>
          <div className="col-4">
            <h3 className="mb-3">User Info</h3>
            <this.EditUsersName edit={edit} firstName={firstName} lastName={lastName} onChange={this.inputChange} />
            <div className="row mb-3">
              <div className="col-6">
                <strong>UCI Net ID:</strong>
              </div>
              <Editable className="col-6" edit={edit} name="uciNetId" value={uciNetId} onChange={this.inputChange}/>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Email:</strong>
              </div>
              <Editable className="col-6" edit={edit} name="email" type="email" value={email} onChange={this.inputChange} />
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Phone Number:</strong>
              </div>
              <Editable className="col-6" edit={edit} error={errors.phone || null} name="phone" type="tel" value={phone} onChange={this.inputChange} />
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Cell Provider:</strong>
              </div>
              <Editable className="col-6" edit={edit} name="cellProvider" displayValue={cellProvidersMap[cellProvider]} value={cellProvider} type="select" options={this.buildOptions(cellProviders, 'name')} onChange={this.inputChange} />
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Shirt Size:</strong>
              </div>
              <Editable className="col-6" edit={edit} name="shirtSize" displayValue={shirtSizesMap[shirtSize]} value={shirtSize} type="select" options={this.buildOptions(shirtSizes, 'size')} onChange={this.inputChange} />
            </div>
            <this.FormControls/>
          </div>
          <div className="col-4">
            <h3>Roles</h3>
            <this.Permissions/>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ admin: { user }, general: { cellProviders, cellProvidersMap, shirtSizes, shirtSizesMap }, user: { roles: loggedInUsersRoles } }) {
  return { cellProviders, cellProvidersMap, loggedInUsersRoles, shirtSizes, shirtSizesMap, user };
}

export default connect(mapStateToProps, {
  adminGetUserData,
  adminSetUserRole,
  adminUpdateUser,
  getCellProviders,
  getShirtSizes
})(AdminUserEdit);
