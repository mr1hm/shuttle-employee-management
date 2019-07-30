import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';


const TopMenu = (props)=> {
    return (
    <nav className="topnav">
        <div>
            {/* <li>
                <Link to="/">Login</Link>
            </li>
            <li>
                <Link to="/welcome/">Go to Welcome Page</Link>
            </li> */}
            <HamburgerMenu>
                <div className="dropdown-item"><Link className="d-block text-center" to="/myinfo">MyInfo</Link></div>
                <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/day/shifts-day">Day</Link></div>
                <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/week/shifts-week">Week</Link></div>
                <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/month/shifts-month">Month</Link></div>
                <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/available/shifts-available">Available</Link></div>
            </HamburgerMenu>
        </div>
    </nav>

    )
}
export default TopMenu;
