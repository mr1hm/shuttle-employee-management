import React from 'react';
import './admin-shifts-display.css';

class AdminShiftsHoverDetailsAndLabels extends React.Component {
  constructor(props) {
    super(props);
    this.startTimer = this.startTimer.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.state = {
      timer: null,
      showing: false,
      top: null,
      left: null
    };
  }
  startTimer(event) {
    var verticalPosition = event.currentTarget.offsetTop + 60;
    var horizontalPosition = event.currentTarget.getBoundingClientRect().left - 50;
    this.setState({
      timer: setTimeout(this.displayMessage, 200),
      top: verticalPosition,
      left: horizontalPosition
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
        onMouseLeave={this.handleMouseOut}
        className="hoverDetailContainer">
        <div className="shiftOwnerLabel d-flex flex-column h-50 px-2">
          <span className='shiftLabel' >{`${this.props.userName.last}, ${this.props.userName.first} ID# ${this.props.userId}`}</span>
          <span className='shiftLabel' >{`${this.props.lineBus}: ${this.props.shiftTime}`}</span>
        </div>
        <div className="hoverMessage"
          style={{ display: this.state.showing ? 'flex' : 'none', top: this.state.top, left: this.state.left }}>
          <i></i>
          <div>{this.props.userName.last}, {this.props.userName.first}</div>
          <div>{this.props.shiftTime}</div>
          <div>Rounds: {this.props.rounds}</div>
        </div>
      </div>
    );
  }
}

export default AdminShiftsHoverDetailsAndLabels;
