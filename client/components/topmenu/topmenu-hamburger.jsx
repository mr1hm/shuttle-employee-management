import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import { createDateStringFromDateObject } from '../../lib/time-functions';

const TopMenuHamburger = props => {
  const currentDateString = props.date ? createDateStringFromDateObject(props.date) : '';// converts unix time to date/at midnight
  return (
    <HamburgerMenu>
      <Link to="/myinfo/">My Info</Link>
      <Link to={`/shifts/day/shifts-day/${currentDateString}`}>Day</Link>
      <Link to={`/shifts/week/shifts-week/${currentDateString}`}>Week</Link>
      <Link to={`/shifts/month/shifts-month/${currentDateString}`}>Month</Link>
      <Link to={`/shifts/available/${currentDateString}`}>Available</Link>
    </HamburgerMenu>

  );
};

export default TopMenuHamburger;
