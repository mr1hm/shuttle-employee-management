import React from 'react';
import './shifts-month.css'
import DayOfMonth from './day-of-week-component';
import TopMenuShift from '../../topmenu/topmenu-shift';

export default class ShiftsMonth extends React.Component {
  constructor(props) {
    super(props);
    this.bundleDays = this.bundleDays.bind(this);
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
  sumHoursOfWeek(){

  }


  calculateSumOfHoursScheduledForWeek(week){
    //takes in an array of shifts for one week as an argument = [{startTime: "600", endTime: "1100", shiftDate: "1563704640000"},{startTime: "1330", endTime: "1630", shiftDate: "1563951600000"}]
    let totalHoursForWeek = 0;
    
    for(let i=0; i<week.length;i++){

      let hourDiff = (week[i].endTime-week[i].startTime)/100;
      let totalHoursForDay = Math.trunc(hourDiff); //5hours
      totalHoursForWeek +=totalHoursForDay;
      
      let fullHours ;
      
    }
    
  }

  calculateSumOfHoursScheduledForWeek() {
        let sumOfHours = null;
        for (let i = 0; i < this.props.weeklyHours.length; i++) {
          var weeklyHours = this.props.weeklyHours
          sumOfHours += (weeklyHours[i].endTime-weeklyHours[i].startTime)/100;
        }
        let fullHours = Math.trunc(sumOfHours);
        let minutes = ((sumOfHours - fullHours) * 60).toFixed(0);
        return (
          fullHours + 'h ' + minutes + 'm'
        );
      }



  displayWeeklyHours(){

  }
  bundleDays() {
    const firstDayOfMonth = this.getIndexFirstDayOfMonth(this.props.date);
    const numberOfDaysInMonth = this.getNumberOfDaysInMonth(this.props.date);

    var monthDivArray=[]
    for(var numberOfDaysOfPrevMonth=0; numberOfDaysOfPrevMonth < new Date(this.props.date).getDay();numberOfDaysOfPrevMonth++){
            monthDivArray.push(<div>{30+numberOfDaysOfPrevMonth}</div>)
          }

    for(var i = firstDayOfMonth; i<numberOfDaysInMonth; i++){
      monthDivArray.push(<DayOfMonth dayIndex={i}/>)
    }
    
    console.log("number of days carried over from prev month: ",new Date(this.props.date).getDay())
    return monthDivArray
    }

  render() {
    return (
      <div class ="calenderContainer">
        <TopMenuShift title="MONTH"/>
        <div class="row">
                <div class="col col-lg-1">
                </div>
                <div class="col">
                  <div class="wrapper">
                      {this.bundleDays()}
                  </div>
                </div>
                <div class="col col-lg-2">
                  <div class="totalHoursColumn">
                    <div class = "totalHoursForWeek">Total Hours for Week 1</div>
                    <div class = "totalHoursForWeek">Total Hours for Week 2</div>
                    <div class = "totalHoursForWeek">Total Hours for Week 3</div>
                    <div class = "totalHoursForWeek">Total Hours for Week 4</div>
                    <div class = "totalHoursForWeek">Total Hours for Week 4</div>
                  </div>
                </div>
        </div>
    </div>

    )
  }
}

