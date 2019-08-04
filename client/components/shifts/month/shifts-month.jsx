import React from 'react';
import './shifts-month.css'
import WeekOfMonth from './week-of-month-component';
import TopMenuShift from '../../topmenu/topmenu-shift';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleWeeks = this.bundleWeeks.bind(this);
    this.getIndexFirstDayOfMonth = this.getIndexFirstDayOfMonth.bind(this);
    this.getNumberOfDaysInMonth = this.getNumberOfDaysInMonth.bind(this);
    this.state = {
      scheduledHoursForCurrentMonth: []
    }
  }
  componentDidMount(){
    fetch('/api/shifts-month.php', {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(jsonRes => {
        console.log("db-datapoints: ", jsonRes)
        console.log("hoursInShift: ", (jsonRes[0].endTime-jsonRes[0].startTime)/100 + " hours on the", (new Date(1563704640000)).getDate() )
        this.setState({
          scheduledHoursForCurrentMonth: jsonRes
        })
      });
  }
  getMonthAndYearForCalendar(unixTimeStamp) {
    const calendarSource = {};
    let targetDay = (typeof unixTimeStamp === 'undefined') ? new Date() : new Date(unixTimeStamp);
    calendarSource.month = targetDay.getMonth();
    calendarSource.year = targetDay.getFullYear();
    return calendarSource;
  }
  getIndexFirstDayOfMonth(unixTimeStamp) {
    const monthFirstDay = new Date(this.getMonthAndYearForCalendar(unixTimeStamp).year, this.getMonthAndYearForCalendar(unixTimeStamp).month);
    return monthFirstDay.getDay();
  }
  getNumberOfDaysInMonth(unixTimeStamp) {
    const monthLastDayDate = new Date(this.getMonthAndYearForCalendar(unixTimeStamp).year, this.getMonthAndYearForCalendar(unixTimeStamp).month + 1, 0);
    return monthLastDayDate.getDate();
  }
  bundleWeeks() {
    const firstDayOfMonth = this.getIndexFirstDayOfMonth(this.props.date);
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth(this.props.date);

    var monthDivArray=[]
    for(var numberOfDaysOfPrevMonth=0; numberOfDaysOfPrevMonth < new Date(this.props.date).getDay();numberOfDaysOfPrevMonth++){
            monthDivArray.push(<div>{30+numberOfDaysOfPrevMonth}</div>)
          }

    for(var i = firstDayOfMonth; i<numberOfDaysInMonth; i++){
      monthDivArray.push(<div>{i}</div>)
    }
    
    console.log("number of days carried over from prev month: ",new Date(this.props.date).getDay())
    return monthDivArray
    }

  render() {
    return (
      <div class="calenderContainer">
        <TopMenuShift title="MONTH"/>
    <div class="wrapper">
                {this.bundleWeeks()}
      </div>
    </div>
    )
  }
}

