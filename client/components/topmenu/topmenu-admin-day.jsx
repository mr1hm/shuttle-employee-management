import React from 'react';
import './topmenu.css';
import TopMenuHamburger from './topmenu-hamburger';
import AdminWeekNav from '../admin-week-nav';

const TopMenuAdminDay = props => {
  return (
    <div className="container-fluid d-flex justify-content-between align-items-center my-2 px-5">
      <h3 className="m-0">Admin - Day</h3>
      <AdminWeekNav date={props.date} onClickDayOfWeek={props.onClickDayOfWeek}/>
      <TopMenuHamburger userId={props.userId} date={props.date} />
    </div>
  );
};
export default TopMenuAdminDay;
