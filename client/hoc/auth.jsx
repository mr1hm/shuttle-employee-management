import React from 'react';
import { connect } from 'react-redux';

export default (allowedRoles = []) => (WrappedComponent, path = '/login', redirectOnAuth = false) => {
  class Auth extends React.Component {
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { auth, history } = this.props;

      if (auth === redirectOnAuth || (!redirectOnAuth && auth !== 'pending' && !this.userHasRole())) {
        history.push(path);
      }
    }

    userHasRole() {
      const { roles } = this.props;

      if (!allowedRoles.length) return true;

      for (let i = 0; i < allowedRoles.length; i++) {
        const role = allowedRoles[i];

        if (roles.includes(role)) return true;
      }

      return false;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(mapStateToProps)(Auth);
};

function mapStateToProps({ user }) {

  return { ...user };
}
