import React from 'react';
import './shift-month-legends.css';

export default function Legends(){
  return (
    <div className="legend-container">
      <div class="row legendRow">
        <div class="col-md-4">
          Scheduled <br></br>
          <div class="blue circle"></div>
        </div>
        <div class="col-md-4">
          Posted <br></br>
          <div class="yellow circle"></div>
        </div>
        <div class="col-md-4">
          Scheduled & Posted <br></br>
          <div class="blueSquare blue circle">
          </div>
        </div>
      </div>
    
    </div>
  )
}