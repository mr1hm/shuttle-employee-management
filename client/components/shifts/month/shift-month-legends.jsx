import React from 'react';
import '../../app.css';
import './shift-month-legends.css';

export default function Legends(){
  return (
    <div className="legend-container">
      <div className="row legendRow">
        <div className="col-md-4">
          Scheduled <br></br>
          <div className="scheduled-shift-color circle"></div>
        </div>
        <div className="col-md-4">
          Posted <br></br>
          <div className="posted-shift-color circle"></div>
        </div>
        <div className="col-md-4">
          Scheduled & Posted <br></br>
          <div className="scheduled-shift-color posted-shift-color circle">
          </div>
        </div>
      </div>
    </div>
  )
}