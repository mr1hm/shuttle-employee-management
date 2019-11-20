import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import { createDateStringFromDateObject } from '../../lib/time-functions';

class TopMenuHamburger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfShifts: 0
    };
  }
  componentDidUpdate(prevProps) {
    const prevNumberOfShifts = prevProps.tradeNotification ? prevProps.tradeNotification.newShifts.length : 0;
    const numberOfShifts = this.props.tradeNotification ? this.props.tradeNotification.newShifts.length : 0;
    if (numberOfShifts !== prevNumberOfShifts) {
      this.setState({
        numberOfShifts: numberOfShifts
      });
    }
  }
  render() {
    // const today = new Date();
    // const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // const currentDateString = this.props.date ? createDateStringFromDateObject(this.props.date) : '';// converts unix time to date/at midnight
    let dateString = this.props.date;
    return (
      <HamburgerMenu notificationCount={this.props.notificationCount} userId={this.props.userId} count={this.state.numberOfShifts}>
        <Link to={{ pathname: '/trade-notification/', state: { newShiftsAndSelectedDriver: this.props.tradeNotification } }}>Notifications</Link>
        <Link to="/myinfo/">My Info</Link>
        <Link to={`/shifts/day/shifts-day/${dateString}`}>Day</Link>
        <Link to={`/shifts/week/shifts-week/${dateString}`}>Week</Link>
        <Link to={`/shifts/month/shifts-month/${dateString}`}>Month</Link>
        <Link to={`/shifts/available/${dateString}`}>Available</Link>
      </HamburgerMenu>

    );

  }

}

export default TopMenuHamburger;
