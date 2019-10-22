import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import { createDateStringFromDateObject } from '../../lib/time-functions';
const NotificationDotContext = React.createContext(0);

const TopMenuHamburger = props => {
  const currentDateString = props.date ? createDateStringFromDateObject(props.date) : '';// converts unix time to date/at midnight
  const numberOfShifts = props.tradeNotification ? props.tradeNotification.newShifts.length : 0;
  // const numberOfShifts = (props.tradeNotification.newShifts.length > 0) ? props.tradeNotification.newShifts.length : 0;

  return (
    <NotificationDotContext.Provider value={numberOfShifts} >
      <HamburgerMenu numberOfShifts={numberOfShifts}>
        <Link className="d-block text-center" to="/myinfo/"><div className="dropdown-item">MyInfo</div></Link>
        <Link className="d-block text-center" to={`/shifts/day/shifts-day/${currentDateString}`}><div className="dropdown-item">Day</div></Link>
        <Link className="d-block text-center" to={`/shifts/week/shifts-week/${currentDateString}`}><div className="dropdown-item">Week</div></Link>
        <Link className="d-block text-center" to={`/shifts/month/shifts-month/${currentDateString}`}><div className="dropdown-item">Month</div></Link>
        <Link className="d-block text-center" to={`/shifts/available/${currentDateString}`}><div className="dropdown-item">Available</div></Link>
        <Link className="d-block text-center" to={{ pathname: '/trade-notification/', state: { newShiftsAndSelectedDriver: props.tradeNotification } }}><div className="dropdown-item">Notification</div></Link>
      </HamburgerMenu>
    </NotificationDotContext.Provider>

  );
};

export default TopMenuHamburger;
