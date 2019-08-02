import React from 'react';
import { Link } from 'react-router-dom';
import './topmenu.css';
import HamburgerMenu from './hamburger-menu';
import Nav from './range-nav-bar'

const TopMenu = (props)=> {
    return (
        <div className="topnav">



<div class="row">
    <div class="col">
        <h3>Shifts - {props.title}</h3>
    </div>
    <div class="col-5">
      <Nav/>
    </div>
    <div class="col">
        <HamburgerMenu>
            <div className="dropdown-item"><Link className="d-block text-center" to="/myinfo">MyInfo</Link></div>
            <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/day/shifts-day">Day</Link></div>
            <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/week/shifts-week">Week</Link></div>
            <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/month/shifts-month">Month</Link></div>
            <div className="dropdown-item"><Link className="d-block text-center" to="/shifts/available/shifts-available">Available</Link></div>
        </HamburgerMenu>
    </div>
  </div>
            
            
            
            
        </div>
    )
}
export default TopMenu;


