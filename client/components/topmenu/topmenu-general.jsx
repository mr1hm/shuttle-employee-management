import React from 'react';
import './topmenu.css';
import TopMenuHamburger from './topmenu-hamburger';

const TopMenuGeneral = (props)=> {
    return (
        <div className="topnav">
            <div className="row">
                <div className="col">
                    <h3>{props.title}</h3>
                </div>
                <div className="col-5">

                </div>
                <div className="col">
                    <TopMenuHamburger/>
                </div>
            </div>  
        </div>
    )
}
export default TopMenuGeneral;

