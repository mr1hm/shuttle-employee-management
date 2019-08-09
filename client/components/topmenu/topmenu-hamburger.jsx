import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';

const TopMenuHamburger = ()=> {
    return (
        <div className="text-dark">
            <HamburgerMenu>
                <Link className="d-block text-center" to="/myinfo"><div className="dropdown-item">MyInfo</div></Link>
                <Link className="d-block text-center" to="/shifts/day/shifts-day"><div className="dropdown-item">Day</div></Link>
                <Link className="d-block text-center" to="/shifts/week/shifts-week"><div className="dropdown-item">Week</div></Link>
                <Link className="d-block text-center" to="/shifts/month/shifts-month"><div className="dropdown-item">Month</div></Link>
                <Link className="d-block text-center" to="/shifts/available"><div className="dropdown-item">Available</div></Link>
            </HamburgerMenu>
        </div>
    )
}

export default TopMenuHamburger;