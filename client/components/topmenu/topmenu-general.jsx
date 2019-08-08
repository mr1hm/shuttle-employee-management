import React from 'react';
import './topmenu.css';
import TopMenuHamburger from './topmenu-hamburger';

const TopMenuGeneral = (props)=> {
    return (
        <div className="container-fluid d-flex justify-content-between align-items-center mt-2">
            <h3>Shifts - {props.title}</h3>
            <TopMenuHamburger/>
        </div>
    );
}
export default TopMenuGeneral;


