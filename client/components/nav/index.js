import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import equal from 'deep-is';
import { userLogout } from '../../actions';
import { getLocalDateString } from '../../lib/time-functions';

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.Links = this.Links.bind(this);
    this.logout = this.logout.bind(this);

    const today = getLocalDateString(new Date());

    this.logoutLink = { 'Logout': this.logout };
    this.myInfo = { 'My Info': '/my-info' };

    this.authRoutes = {
      admin: {
        'Users': '/admin-user-summary',
        'Operator Availability': '/admin-operator-availability',
        'Schedule': {
          'Live Field View': '/live-field-status',
          'Master Schedule': '/master-schedule'
        }
      },
      operators: {
        'My Schedule': {
          'Today': `/shifts/day/${today}`,
          'This Week': `/shifts/week/${today}`,
          'This Month': `/shifts/month/${today}`
        },
        'Shifts': {
          'Master Schedule': '/master-schedule',
          'Available Shifts': `/shifts/available/${today}`,
          'Trade/Swap Shift': '/trade-swap'
        },
        'Administration': {
          'Submit Availability': '/operator-availability'
        }
      }
    };

    this.state = {
      routes: {}
    };
  }

  componentDidMount() {
    this.setRoutes();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.roles, prevProps.roles)) {
      this.setRoutes(prevProps);
    }
  }

  setRoutes(prevProps = null) {
    const { auth, roles } = this.props;
    let routes = {};

    if (prevProps && !auth) {
      return this.setState({ routes });
    }

    if (!auth || auth === 'pending') return;

    if (roles && roles.length) {
      roles.forEach(role => {
        const authRoutes = this.authRoutes[role] || null;

        if (routes) {
          routes = { ...routes, ...authRoutes };
        }
      });
    }

    routes = { ...this.myInfo, ...routes, ...this.logoutLink };

    this.setState({ routes });
  }

  logout() {
    this.props.userLogout();
  }

  buildDropdown(links, name) {
    const items = [];

    for (let [k, v] of Object.entries(links)) {
      items.push(
        <Link key={k} className="dropdown-item" to={v}>{k}</Link>
      );
    }

    return (
      <li key={name} className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown">{name}</a>

        <div className="dropdown-menu">
          {items}
        </div>
      </li>
    );
  }

  Links() {
    const { routes } = this.state;
    const links = [];

    for (let [k, v] of Object.entries(routes)) {
      switch (typeof v) {
        case 'string':
          links.push(
            <li key={k} className="navbar-nav mr-auto">
              <Link className="nav-link" to={v}>{k}</Link>
            </li>
          );
          continue;
        case 'object':
          links.push(this.buildDropdown(v, k));
          continue;
        case 'function':
          links.push(
            <li key={k} className="navbar-nav mr-auto">
              <a href="#" className="nav-link" onClick={v}>{k}</a>
            </li>
          );
          continue;
      }
    }

    return (
      <div className="collapse navbar-collapse" id="main-nav">
        <ul className="navbar-nav ml-auto">
          {links}
        </ul>
      </div>
    );
  }

  render() {

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/welcome">Anteater Express</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <this.Links/>
      </nav>
    );
  }
}

function mapStateToProps({ user: { auth, roles } }) {
  return { auth, roles };
}

export default connect(mapStateToProps, { userLogout })(Nav);
