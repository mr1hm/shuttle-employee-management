import React from "react";
import AdminShiftsCombinedRounds from './admin-shifts-combined-rounds';
import './admin-shifts-display.css';

class AdminShiftsDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const range = this.props.range;
    const shiftData = this.props.shiftData;
    const rangeDistance = range.max - range.min;
    const startPercent = ((shiftData.start - range.min) / rangeDistance) * 100;
    const endPercent = ((shiftData.end - range.min) / rangeDistance) * 100;
    const widthPercent = endPercent - startPercent;
    const shiftsDetailsArray = this.props.children;
    console.log('shiftDetails: ', this.props.children);
    console.log('shift data: ', this.props.shiftData)
    return (
      <div
        className={`shift shiftBase ${this.props.type}`}
        style={{
          width: widthPercent + "%",
          left: startPercent + "%",
          borderLeft: "1px solid black",
          borderRight: "1px solid black"
        }}
      >
      {shiftsDetailsArray.map((element, index) => (
        <AdminShiftsCombinedRounds
          // test={data.test}
          key={index}
          type={(element.user_id === "1" || element.user_id === 1) ? 'alertShift' : 'active'}
          range={{ min: 6, max: 24 }}
          shiftData={{start: element.start_time, end: element.end_time} } 
        />
      ))}
      </div>
    );
  }
}

export default AdminShiftsDisplayComponent;