import React from 'react';
import './shift-month-legends.css';

export default function Legends(){
  return (
    <div className="legend-container">
      <div className="col-sm scheduled">
        <div className="row">
          Scheduled <div className = "scheduled-icon"></div>
        </div>
      </div>
      <div class="col-sm posted">
        
        <div className="row">
          Posted <div className = "posted-icon"></div>
        </div>
      </div>

        <div className="col-sm scheduledposted">
        <div className="row">
          Scheduled & Posted <div className = "both-icon"><div className = "scheduled-icon"></div></div>
        </div>
        </div>
    </div>
  )
}