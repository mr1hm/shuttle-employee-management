import React from 'react';
import './shift-month-legends.css';

export default function Legends(){
  return (
    <div class="legend-container">
      <div class="col-sm scheduled">
        <div className="row">
          Scheduled <div class = "scheduled-icon"></div>
        </div>
      </div>
      <div class="col-sm posted">
        
        <div className="row">
          Posted <div class = "posted-icon"></div>
        </div>
      </div>

        <div class="col-sm scheduledposted">
        <div className="row">
          Scheduled & Posted <div class = "both-icon"><div class = "scheduled-icon"></div></div>
        </div>
        </div>
    </div>
  )
}