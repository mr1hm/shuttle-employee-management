import React from "react";
import './admin-shifts-display.css';

class AdminShiftsHoverDetailsAndLabels extends React.Component {
  constructor(props) {
    super(props);
    this.startTimer = this.startTimer.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.state = {
      timer: null,
      showing: false
    }
  }
  startTimer() {
    this.setState({
      timer: setTimeout(this.displayMessage, 500)
    });
  }
  displayMessage() {
    this.setState({
      showing: true
    });
  }
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  handleMouseOut() {
    if (this.state.showing) {
      this.setState({
        showing: false,
        timer: null
      });
    } else {
      clearTimeout(this.state.timer);
      this.setState({
        timer: null
      });
    }
  }
  render() {
    return (
      <div className="hoverDetailContainer">
        <div onMouseEnter={this.startTimer} 
             onMouseOut={this.handleMouseOut} 
             className="shiftOwnerLabel">
          {this.props.userName.last}
        </div>
        <div className="shiftOwnerLabel">
          ID# {this.props.userId}</div>
        <div className="hoverMessage"
             style={{ display: this.state.showing ? "flex" : "none" }}>
          <div>{this.props.userName.last}, {this.props.userName.first}</div>
          <div>{this.props.shiftTime}</div>
          <div>Rounds: {this.props.rounds}</div>
        </div>
      </div>
    );
  }
}

export default AdminShiftsHoverDetailsAndLabels;