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
    const currentDateString = this.props.date ? createDateStringFromDateObject(this.props.date) : '';// converts unix time to date/at midnight
    // const numberOfShifts = this.props.tradeNotification ? this.props.tradeNotification.newShifts.length : 0;
    return (
      <HamburgerMenu count={this.state.numberOfShifts}>
        <Link className="d-block text-center" to="/myinfo/"><div className="dropdown-item">MyInfo</div></Link>
        <Link className="d-block text-center" to={`/shifts/day/shifts-day/${currentDateString}`}><div className="dropdown-item">Day</div></Link>
        <Link className="d-block text-center" to={`/shifts/week/shifts-week/${currentDateString}`}><div className="dropdown-item">Week</div></Link>
        <Link className="d-block text-center" to={`/shifts/month/shifts-month/${currentDateString}`}><div className="dropdown-item">Month</div></Link>
        <Link className="d-block text-center" to={`/shifts/available/${currentDateString}`}><div className="dropdown-item">Available</div></Link>
        <Link className="d-block text-center" to={{ pathname: '/trade-notification/', state: { newShiftsAndSelectedDriver: this.props.tradeNotification } }}><div className="dropdown-item">Notification</div></Link>
      </HamburgerMenu>

    );

  }
  // const numberOfShifts = (props.tradeNotification.newShifts.length > 0) ? props.tradeNotification.newShifts.length : 0;

}

export default TopMenuHamburger;
