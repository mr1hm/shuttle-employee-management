import React from 'react';
import { connect } from 'react-redux';

export default (allowedRoles = []) => (WrappedComponent, props = {}, to = '/login') => {
  class Auth extends React.Component {
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { auth, history } = this.props;

      if (!auth || (auth !== 'pending' && !this.userHasRole())) {
        history.push(to);
      }
    }

    userHasRole() {
      const { roles } = this.props;

      if (!allowedRoles.length) return true;

      if (!roles) return false;

      for (let i = 0; i < allowedRoles.length; i++) {
        const role = allowedRoles[i];

        if (roles.includes(role)) return true;
      }

      return false;
    }

    render() {
      const { auth } = this.props;

      if (auth === 'pending' || !auth || (auth && auth !== 'pending' && !this.userHasRole())) return null;

      return <WrappedComponent {...this.props} {...props} />;
    }
  }

  return connect(mapStateToProps)(Auth);
};

function mapStateToProps({ user }) {

  return { ...user };
}
