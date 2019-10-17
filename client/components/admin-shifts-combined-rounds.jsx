import React from "react";
import AdminShiftsHoverDetailsAndLabels from './admin-shifts-hover-details-and-labels';
import {convertMilitaryTime} from '../lib/time-functions';
import './admin-shifts-display.css';

class AdminShiftsCombinedRounds extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  timeInMinutesFromMidnight(time){
    let hoursToMinutes = Math.floor(time / 100) * 60;
    let minutesFromTime = time - Math.floor(time / 100) * 100;
    return hoursToMinutes + minutesFromTime;
  }
  handleClick(){
    this.props.onClickAvailableDrivers(this.props.shiftData.start, this.props.shiftData.end);
  }
  generateShiftHoverElement() {
    const shiftStartMeridian = convertMilitaryTime(this.props.shiftData.start);
    const shiftEndMeridian = convertMilitaryTime(this.props.shiftData.end);
    const shiftTimeMeridian = shiftStartMeridian + " - " + shiftEndMeridian;
    if (this.props.type === 'active') {
      return (
        <AdminShiftsHoverDetailsAndLabels
          userName={this.props.userName}
          userId={this.props.userId}
          shiftTime={shiftTimeMeridian}
          rounds={this.props.rounds}
        />
      );
    } else return <div></div>
  }
  render() {
    const rangeMax = this.timeInMinutesFromMidnight(this.props.range.max);
    const rangeMin = this.timeInMinutesFromMidnight(this.props.range.min);
    const shiftStart = this.timeInMinutesFromMidnight(this.props.shiftData.start);
    const shiftEnd = this.timeInMinutesFromMidnight(this.props.shiftData.end);
    const rangeDistance = rangeMax - rangeMin;
    const startPercent = ((shiftStart - rangeMin) / rangeDistance) * 100;
    const endPercent = ((shiftEnd - rangeMin) / rangeDistance) * 100;
    const widthPercent = endPercent - startPercent;
    return (
      <div
        onClick={this.handleClick}
        className={`shift shiftBase ${this.props.type}`}
        style={{
          width: widthPercent + "%",
          left: startPercent + "%",
          borderLeft: "1px solid black",
          borderRight: "1px solid black"
        }}>
          {this.generateShiftHoverElement()}
        </div>
    );      
  }
}

export default AdminShiftsCombinedRounds;