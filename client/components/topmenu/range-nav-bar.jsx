import React from 'react';
import './nav-styles.css';

export default function Nav (){

const dateRange = [
  {
    "year":2019,
    "month":7,
    "date":28
  },
  {
    "year":2019,
    "month":7,
    "date":29
  },
  {
    "year":2019,
    "month":7,
    "date":30
  },
  {
    "year":2019,
    "month":7,
    "date":31
  },
  {
    "year":2019,
    "month":8,
    "date":1
  },
  {
    "year":2019,
    "month":8,
    "date":4
  },
  {
    "year":2019,
    "month":8,
    "date":10
  },
  {
    "year":2019,
    "month":8,
    "date":12
  },
  {
    "year":2019,
    "month":8,
    "date":17
  },
  {
    "year":2019,
    "month":8,
    "date":19
  },
  {
    "year":2019,
    "month":8,
    "date":20
  }
]

function displayCurrentDate(range){

  let endDate = new Date();
  endDate.setMonth([range.length-1].month-1);
  endDate.setDate(range[range.length-1].date-1);
  let startDate = new Date();
  startDate.setMonth(range[0].month-1);
  startDate.setDate(range[0].date-1);

  if(range.length===1){
    let dateForDisplay = range[0].year + ' . ' + range[0].month + ' . ' + range[0].date;
    return(dateForDisplay);
  } else if (range.length <= 7){
    let startDate = range[0];
    let endDate = range[range.length-1];
    let rangeFordisplay = `${startDate.month}-${startDate.date} to ${endDate.month}-${endDate.date}`;
    return(rangeFordisplay);
  } else{
    const monthName = ["January","Feburary","March","April","May","June","July","August","September","October","November","Devember"]
    return(monthName[range[0].month-1])
  }
}

return (
    <div className="weekSelectionContainer">
      <div className="weekSelector weekDropDown weekDropDownLeft"></div>
      <div className="weekSelection">{displayCurrentDate(dateRange)}</div>
      <div className="weekSelector weekDropDown weekDropDownRight"></div>
    </div>
  )
}