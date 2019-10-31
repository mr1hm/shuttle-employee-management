import React from 'react';
import AdminShiftsHoverDetailsAndLabels from './admin-shifts-hover-details-and-labels';
import { convertMilitaryTime } from '../lib/time-functions';
import './admin-shifts-display.css';

class AdminShiftsCombinedRounds extends React.Component {
  constructor(props) {
    super(props);
    this.shiftStartMeridian = this.convertMilitartyTimeToStringWithColon(this.props.shiftData.start);
    this.shiftEndMeridian = this.convertMilitartyTimeToStringWithColon(this.props.shiftData.end);
    this.shiftTimeMeridian = this.shiftStartMeridian + ' - ' + this.shiftEndMeridian;
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: false
    };
  }
  convertMilitartyTimeToStringWithColon(time) {
    let hours = Math.floor(time / 100);
    let amOrPm = '';
    if (hours >= 12) {
      amOrPm = 'PM';
    } else {
      amOrPm = 'AM';
    }
    if (hours > 12) {
      hours = hours % 12;
    }
    time = time.toString();
    let minutes = time[time.length - 2] + time[time.length - 1];
    return hours + ':' + minutes + amOrPm;
  }
  convertRoundTimesToTimeMeridian(rounds) {
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      let roundStartMeridian = convertMilitaryTime(rounds[roundIndex].start.toString());
      let roundEndMeridian = convertMilitaryTime(rounds[roundIndex].end.toString());
      rounds[roundIndex]['roundTime'] = roundStartMeridian + ' - ' + roundEndMeridian;
    }
    return rounds;
  }
  timeInMinutesFromMidnight(time) {
    let hoursToMinutes = Math.floor(time / 100) * 60;
    let minutesFromTime = time - Math.floor(time / 100) * 100;
    return hoursToMinutes + minutesFromTime;
  }
  handleClick() {
    if (this.props.selecting) {
      this.props.onClickAvailableDrivers(parseInt(this.props.shiftData.start), parseInt(this.props.shiftData.end), parseInt(this.props.roundId), parseInt(this.props.userId), this.props.lineBus);
    }
    this.setState({ selected: !this.state.selected });
    console.log('shift click: ', this.state.selected, this.props.shiftData, parseInt(this.props.roundId), this.props.userId);
    this.props.onClickShifts({
      'user_name': this.props.userName,
      'user_id': this.props.userId,
      'shift_time': this.shiftTimeMeridian,
      'rounds': this.convertRoundTimesToTimeMeridian(this.props.rounds),
      'round_id': this.props.roundId,
      'shift_type': this.props.type,
      'line_bus': this.props.lineBus
    });
  }
  generateShiftHoverElement() {
    if (this.props.type === 'active') {
      return (
        <AdminShiftsHoverDetailsAndLabels
          userName={this.props.userName}
          userId={this.props.userId}
          shiftTime={this.shiftTimeMeridian}
          rounds={this.props.rounds.length}
        />
      );
    } else return <div></div>;
  }
  componentDidUpdate(prevProps) {
    if (this.props.selecting !== prevProps.selecting) {
      this.setState({ selected: false });
    }
    if (!this.props.selecting && this.props.shiftSelected !== prevProps.shiftSelected) {
      if (this.props.shiftSelected !== this.props.roundId) {
        console.log('shiftclick: ', this.props.shiftSelected);
        this.setState({ selected: false });
      }
    }
  }
  render() {
    const rangeMax = this.timeInMinutesFromMidnight(this.props.range.max);
    const rangeMin = this.timeInMinutesFromMidnight(this.props.range.min);
    const shiftStart = this.timeInMinutesFromMidnight(this.props.shiftData.start);
    const shiftEnd = this.timeInMinutesFromMidnight(this.props.shiftData.end);
    const rangeDistance = rangeMax - rangeMin;
    const widthPercent = (shiftEnd - shiftStart) / rangeDistance;
    return (
      <div
        onClick={this.handleClick}
        className={`operatorShift rounded border h-75 ${this.props.type} ${this.state.selected ? 'shiftSelected' : ''}`}
        style={{ width: widthPercent * 1808 + 'px' }}>
        {this.generateShiftHoverElement()}
      </div>
    );
  }
}

export default AdminShiftsCombinedRounds;
