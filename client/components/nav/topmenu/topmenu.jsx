import React from 'react';
import { Link } from 'react-router-dom';


const TopMenu = (props)=> (
    <nav>
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
        </ul>
    </nav>
)

export default TopMenu;