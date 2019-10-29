import React from 'react';
import AdminShiftsCombinedRounds from './admin-shifts-combined-rounds';
import './admin-shifts-display.css';

class AdminShiftsDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecting: this.props.selecting
    };
  }
  calculateMinutesHours(startTime, endTime) {
    $startHourDigits = floor(startTime / 100);
    $startMinuteDigits = startTime / 100 - startHourDigits;

    var endHourDigits = floor(endTime / 100);
    var endMinuteDigits = endTime / 100 - endHourDigits;

    var startTimeInMinutes = startHourDigits * 60 + startMinuteDigits * 100;
    var endTimeInMinutes = endHourDigits * 60 + endMinuteDigits * 100;

    var shiftLengthInMinutes = endTimeInMinutes - startTimeInMinutes;
    return round(shiftLengthInMinutes);
  }

  render() {
    const range = this.props.range;
    const shiftData = this.props.shiftData;
    const rangeDistance = range.max - range.min;
    const startPercent = ((shiftData.start - range.min) / rangeDistance) * 100;
    const endPercent = ((shiftData.end - range.min) / rangeDistance) * 100;
    const widthPercent = endPercent - startPercent;
    const shiftsDetailsArray = this.props.children;
    return (
      <div
        className={`shift shiftBase ${this.props.type}`}
        style={{
          width: widthPercent + '%',
          left: startPercent + '%',
          borderLeft: '1px solid black',
          borderRight: '1px solid black'
        }}
      >
        {shiftsDetailsArray.map((element, index) => {
          var roundType = '';
          if (element.user_id === 'n/a') {
            roundType = 'nonOperational';
          } else if (element.user_id === '1' || element.user_id === 1) {
            roundType = 'alertShift';
          } else {
            roundType = 'active';
          }
          return (
            < AdminShiftsCombinedRounds
              key={index}
              onClickAvailableDrivers={this.props.onClickAvailableDrivers}
              onClickShifts={this.props.onClickShifts}
              type={roundType}
              userId={element.user_id}
              userName={element.user_name}
              rounds={element.rounds}
              roundId={element.round_id}
              range={{ min: 600, max: 2400 }}
              shiftData={{ start: element.start_time, end: element.end_time }}
              widthPercent={widthPercent}
              startPercent={startPercent}
              selecting={this.state.selecting} />
          );
        })}
      </div>
    );
  }
}

export default AdminShiftsDisplayComponent;
