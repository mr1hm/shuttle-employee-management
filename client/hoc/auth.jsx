import React from 'react';
import { connect } from 'react-redux';

export default (WrappedComponent, path = '/login', redirectOnAuth = false) => {
  class Auth extends React.Component {
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { auth, history } = this.props;

      if (auth === redirectOnAuth) {
        history.push(path);
      }
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
