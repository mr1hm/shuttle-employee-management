import React from 'react';
import './topmenu.css';
import TopMenuHamburger from './topmenu-hamburger';
import Nav from './range-nav-bar';

const TopMenuShift = props => {
  return (
    <div className="topMenuContainer container-fluid d-flex justify-content-between align-items-center mt-2 mb-2 px-5">
      <h3 className="m-0">Shifts - {props.title}</h3>
      <Nav page={props.page} date={props.date} dateString={props.dateString} />
      <TopMenuHamburger userId={props.userId} date={props.date}/>
    </div>
  );
};
export default TopMenuShift;
