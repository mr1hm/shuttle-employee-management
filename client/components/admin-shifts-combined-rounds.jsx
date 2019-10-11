import React from "react";
import './admin-shifts-display.css';

class AdminShiftsCombinedRounds extends React.Component {
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
    console.log('this.props.type: ', this.props.type);
    console.log('widthPercet: ', widthPercent);
    console.log('rangeDistance: ', rangeDistance);
    console.log('endPercent: ', endPercent);
    console.log('startPercent: ', startPercent);
    console.log('shiftData: ', shiftData);
    console.log('range ', range);
    return (
      <div
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

//             // test={data.test}
//             key={index}
//             type={element.user_id === "1" || element.user_id === 1? 'alertShift' : 'active'}
//             range={{ min: 6, max: 24 }}
//             shiftData={{start: element.start_time, end: element.end_time} } 
//             // children={[]

export default AdminShiftsCombinedRounds;