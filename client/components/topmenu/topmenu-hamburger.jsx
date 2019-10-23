import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import { createDateStringFromDateObject } from '../../lib/time-functions';

class TopMenuHamburger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfShifts: 2
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
    const currentDateString = this.props.date ? createDateStringFromDateObject(this.props.date) : '';// converts unix time to date/at midnight
    // const numberOfShifts = this.props.tradeNotification ? this.props.tradeNotification.newShifts.length : 0;
    return (

      <HamburgerMenu count={this.state.numberOfShifts}>
        <Link to="/myinfo/">My Info</Link>
        <Link to={`/shifts/day/shifts-day/${currentDateString}`}>Day</Link>
        <Link to={`/shifts/week/shifts-week/${currentDateString}`}>Week</Link>
        <Link to={`/shifts/month/shifts-month/${currentDateString}`}>Month</Link>
        <Link to={`/shifts/available/${currentDateString}`}>Available</Link>
        <Link to={{ pathname: '/trade-notification/', state: { newShiftsAndSelectedDriver: this.props.tradeNotification } }}>Notifications</Link>
      </HamburgerMenu>

    );

  }
  // const numberOfShifts = (props.tradeNotification.newShifts.length > 0) ? props.tradeNotification.newShifts.length : 0;

}

export default TopMenuHamburger;
