import React from 'react';
import '../../app.css';
import './shift-month-legends.css';

export default function Legends() {
  return (
    <div className="legendContainer w-100 d-flex align-items-center px-3 my-3">
      <div className="d-flex align-items-center mr-4">
        <div className="scheduled-shift-color circle mx-2"></div>
        Scheduled
      </div>
      <div className="d-flex align-items-center mr-4">
        <div className="posted-shift-color circle mx-2"></div>
        Posted
      </div>
      <div className="d-flex align-items-center mr-4">
        <div className="scheduled-shift-color posted-shift-color circle mx-2"> </div>
        Scheduled & Posted
      </div>
    </div>
  );
}
