import React from 'react';
import { convertMilitaryTime } from '../../../lib/time-functions';
import './round.css';

class Round extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      id: this.props.id
    };
    this.selectShift = this.selectShift.bind(this);
  }
  selectShift() {
    const { id } = this.state;
    this.setState({ clicked: !this.state.clicked });
    this.props.selectShift(id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.selectShift();
    }
  }
  render() {
    const className = this.state.clicked ? 'shift selected' : 'shift';
    console.log(className);
    const { startTime, endTime } = this.props;
    return (
      <tr className={className} onClick={this.selectShift}>
        <td>{convertMilitaryTime(startTime)}</td>
        <td>{convertMilitaryTime(endTime)}</td>
      </tr>
    );
  }
}

export default Round;
