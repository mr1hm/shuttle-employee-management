import React from 'react';
import './topmenu.css';
import TopMenuHamburger from './topmenu-hamburger';
import Nav from './range-nav-bar';

const TopMenuShift = (props)=> {
    return (
        <div className="topnav">
            <div className="row">
                <div className="col">
                    <h3>Shifts - {props.title}</h3>
                </div>
                <div className="col-5">
                    <Nav page={props.page} date={props.date}/> 
                </div>
                <div className="col">
                    <TopMenuHamburger/>
                </div>
            </div>  
        </div>
    )
}
export default TopMenuShift;


