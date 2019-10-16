import React from "react";
import './admin-shifts-display.css';

class AdminShiftsHoverDetails extends React.Component {
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
      <div
        onMouseEnter={this.startTimer}
        onMouseOut={this.handleMouseOut}
        className="hoverDetailContainer"
      >
        <div
          className="hoverMessage"
          style={{ display: this.state.showing ? "flex" : "none" }}
        >
          <i></i>
          <div>{this.props.userName}</div>
          <div>{this.props.shiftTime}</div>
          <div># of rounds: {this.props.rounds}</div>
        </div>
      </div>
    );
  }
}

export default AdminShiftsHoverDetails;