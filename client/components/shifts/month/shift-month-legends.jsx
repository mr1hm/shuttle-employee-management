import React from 'react';
import '../../app.css';
import './shift-month-legends.css';

export default function Legends(){
  return (
    <div className="legend-container">
      <div class="row legendRow">
        <div class="col-md-4">
          Scheduled <br></br>
          <div class="scheduled-shift-color circle"></div>
        </div>
        <div class="col-md-4">
          Posted <br></br>
          <div class="posted-shift-color circle"></div>
        </div>
        <div class="col-md-4">
          Scheduled & Posted <br></br>
          <div class="scheduled-and-posted-shift-color circle">
          </div>
        </div>
      </div>
    
    </div>
  )
}