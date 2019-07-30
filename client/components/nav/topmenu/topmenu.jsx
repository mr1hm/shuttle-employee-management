import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';


const TopMenu = (props)=> (
    <nav className="topnav">
        <ul>
            <li>
                <Link to="/">Login</Link>
            </li>
            <li>
                <Link to="/welcome/">Go to Welcome Page</Link>
            </li>
            <li>
                <Link to="/shifts/week">Shifts (Week)</Link>
            </li>
            <li>
                <Link to="/shifts/month/shifts-month/">Shifts (Month)</Link>
            </li>
        </ul>
    </nav>
)

export default TopMenu;