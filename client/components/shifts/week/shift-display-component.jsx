import React from "react";

class ShiftDisplayComponent extends React.Component {
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
    return (
      <div
        className={`shift shiftBase ${this.props.type}`}
        style={{
          width: widthPercent + "%",
          left: startPercent + "%"
        }}
      >
        {this.props.children.map((data, index) => (
          <ShiftDisplayComponent
            test={data.test}
            type={data.type}
            range={{ min: data.range.min, max: data.range.max }}
            shiftData={ {start: data.shiftData.start, end: data.shiftData.end} } 
            children={[]}
          />
        ))}
      </div>
    );
  }
}

export default ShiftDisplayComponent;