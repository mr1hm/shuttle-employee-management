import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import { createDateStringFromDateObject } from '../../lib/time-functions';


const TopMenuHamburger = (props)=> {

    var currentDateString = props.date ? createDateStringFromDateObject(props.date) : '';// converts unix time to date/at midnight

    return (
        <div className="text-dark">
            <HamburgerMenu>
                <Link className="d-block text-center" to="/myinfo/"><div className="dropdown-item">MyInfo</div></Link>
                <Link className="d-block text-center" to={`/shifts/day/shifts-day/${currentDateString}`}><div className="dropdown-item">Day</div></Link>
                <Link className="d-block text-center" to={`/shifts/week/shifts-week/${currentDateString}`}><div className="dropdown-item">Week</div></Link>
                <Link className="d-block text-center" to={`/shifts/month/shifts-month/${currentDateString}`}><div className="dropdown-item">Month</div></Link>
                <Link className="d-block text-center" to={`/shifts/available/${currentDateString}`}><div className="dropdown-item">Available</div></Link>
            </HamburgerMenu>
        </div>
    )
}

export default TopMenuHamburger;
