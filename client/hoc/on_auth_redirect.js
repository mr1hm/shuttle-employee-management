import React from 'react';
import { connect } from 'react-redux';

export default (WrappedComponent, to = '/') => {
  class OnAuthRedirect extends React.Component {
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    checkAuth() {
      const { auth, history } = this.props;

      if (auth === true) {
        history.push(to);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(mapStateToProps)(OnAuthRedirect);
};

function mapStateToProps({ user }) {
  return { ...user };
}
