import React from "react";
import AdminShiftsHoverDetailsAndLabels from './admin-shifts-hover-details-and-labels';
import {convertMilitaryTime} from '../lib/time-functions';
import './admin-shifts-display.css';

class AdminShiftsCombinedRounds extends React.Component {
  constructor(props) {
    super(props);
    this.shiftStartMeridian = convertMilitaryTime(this.props.shiftData.start);
    this.shiftEndMeridian = convertMilitaryTime(this.props.shiftData.end);
    this.shiftTimeMeridian = this.shiftStartMeridian + " - " + this.shiftEndMeridian;
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: this.props.selecting
    }
  }
  timeInMinutesFromMidnight(time){
    let hoursToMinutes = Math.floor(time / 100) * 60;
    let minutesFromTime = time - Math.floor(time / 100) * 100;
    return hoursToMinutes + minutesFromTime;
  }
  handleClick(){
    if(!this.props.selecting){
      return;
    }
    this.setState( {selected: !this.state.selected} );
    console.log(this.props.shiftData, parseInt(this.props.roundId), this.props.userId);
    this.props.onClickAvailableDrivers(parseInt(this.props.shiftData.start), parseInt(this.props.shiftData.end), parseInt(this.props.roundId), parseInt(this.props.userId));
    this.props.onClickShifts({
      'user_name': this.props.userName,
      'user_id': this.props.userId,
      'shift_time': this.shiftTimeMeridian,
      'rounds': this.props.rounds,
      'round_id': this.props.roundId,
      'shift_type': this.props.type
    });
  }
  generateShiftHoverElement() {
    if (this.props.type === 'active') {
      return (
        <AdminShiftsHoverDetailsAndLabels
          userName={this.props.userName}
          userId={this.props.userId}
          shiftTime={this.shiftTimeMeridian}
          rounds={this.props.rounds}
        />
      );
    } else return <div></div>
  }
  componentDidUpdate(prevProps){
    if(this.props.selecting !== prevProps.selecting){
      this.setState({ selected: this.props.selected });
    }
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
        className={`shift shiftBase h-100 ${this.props.type} ${this.state.selected ? "shiftSelected": ""}`}
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
