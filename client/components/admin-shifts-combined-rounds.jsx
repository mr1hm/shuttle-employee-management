import React from "react";
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
    this.props.onClickAvailableDrivers();
    console.log('shift data click: ', this.props.shiftData.start, this.props.shiftData.end, this.props.userId);
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
        }}></div>
    );
  }
}

export default AdminShiftsCombinedRounds;
