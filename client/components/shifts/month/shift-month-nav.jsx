import React from 'react';
import './shift-month-nav-styles.css';

export default function MonthNav(){
  
  return (
    <div class="weekSelectionContainer">
      <div class="weekSelector weekDropDown weekDropDownLeft"></div>
      <div class="weekSelection">July</div>
      <div class="weekSelector weekDropDown weekDropDownRight"></div>
    </div>
  )
}