import React from 'react';
import './shift-month-nav-styles.css';

export default function MonthNav (){
  
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let d = new Date();
var selectedMonth = (monthNames[d.getMonth()]);

function previousMonth (){
  let d = new Date();
  selectedMonth = (monthNames[d.getMonth()-1]);
  // return selectedMonth
  document.write(monthNames[d.getMonth()-1])
}

function nextMonth (){
  let d = new Date();
  selectedMonth = (monthNames[d.getMonth()+1]);
  // return selectedMonth
  document.write(monthNames[d.getMonth()+1])
}

function displayMonth(){
  return selectedMonth;
}

return (
    <div class="weekSelectionContainer">
      <div class="weekSelector weekDropDown weekDropDownLeft" onClick={previousMonth}></div>
      <div class="weekSelection">{displayMonth()}</div>
      <div class="weekSelector weekDropDown weekDropDownRight" onClick={nextMonth}></div>
    </div>
  )
}