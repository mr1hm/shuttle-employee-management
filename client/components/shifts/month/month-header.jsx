import React from 'react';
import MonthNav from './shift-month-nav'

export default function MonthHeader() {
  return (
      <div className="row">
        <div className="col">
          <h5>MY SHIFT - MONTH</h5>
        </div>
        <div className="col-6">  
          <MonthNav/>
        </div>
        <div className="col">
        </div>
      </div>
  );
}