import React from 'react';
import { connect } from 'react-redux';
import { adminGetUserData, adminSetUserRole } from '../../actions';
import { rolesList } from '../../config/permissions';
import { defaultProfileImage } from '../../config/profile';
import './admin-edit-user.scss';

class AdminUserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.Permissions = this.Permissions.bind(this);
  }

  componentDidMount() {
    const { adminGetUserData, match: { params } } = this.props;

    adminGetUserData(params.uciId);
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
          <input id={mid} type="checkbox" checked={value} readOnly/>
          <label htmlFor={mid} className="ml-3">{name}</label>
        </li>
      );
    });

    return (
      <ul className="list-group">
        {roleItems}
      </ul>
    );
  }

  render() {
    const { user } = this.props;

    if (!user) return <p>Loading...</p>;

    const { cellProvider, email, firstName, lastName, phone, shirtSize, uciNetId, url } = user;

    return (
      <div className="admin-edit-user container">
        <h1 className="text-center my-3">Admin - Edit User</h1>
        <div className='row'>
          <div className="col-4">
            <h3>{`${firstName} ${lastName}`}</h3>
            <div className="pr-3">
              <img className="img-fluid" src={url || defaultProfileImage} />
            </div>
          </div>
          <div className="col-4">
            <h3 className="mb-3">User Info</h3>
            <div className="row mb-3">
              <div className="col-6">
                <strong>UCI Net ID:</strong>
              </div>
              <div className="col-6">{uciNetId}</div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Email:</strong>
              </div>
              <div className="col-6">{email}</div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Phone Number:</strong>
              </div>
              <div className="col-6">{phone || <span className="text-danger">Not Set</span>}</div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Cell Provider:</strong>
              </div>
              <div className="col-6">{cellProvider || <span className="text-danger">Not Set</span>}</div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Shirt Size:</strong>
              </div>
              <div className="col-6">{shirtSize || <span className="text-danger">Not Set</span>}</div>
            </div>
            <div className="d-flex justify-content-center">
              <button onClick={this.handleEditButton} className="btn-sm btn-primary mr-5">Edit Info</button>
            </div>
          </div>
          <div className="col-4">
            <h3>Roles</h3>
            <this.Permissions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ admin: { user }, user: { roles: loggedInUsersRoles } }) {
  return { loggedInUsersRoles, user };
}

export default connect(mapStateToProps, {
  adminGetUserData,
  adminSetUserRole
})(AdminUserEdit);
