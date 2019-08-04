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
                    <Nav/> 
                    {/* pass down a prop that lets it know what the new content will be */}
                </div>
                <div className="col">
                    <TopMenuHamburger/>
                </div>
            </div>  
        </div>
    )
}
export default TopMenuShift;


