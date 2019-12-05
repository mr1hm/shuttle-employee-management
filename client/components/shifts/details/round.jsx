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
    this.toggleSelectShift = this.toggleSelectShift.bind(this);
  }
  toggleSelectShift() {
    this.setState({ clicked: !this.state.clicked });
    const { id } = this.state;
    this.props.selectShift(id);
  }
  componentDidUpdate(prevProps, prevState) {
  }
  render() {
    const className = this.state.clicked ? 'shift selected' : 'shift';
    const { startTime, endTime } = this.props;
    return (
      <tr className={className} onClick={this.toggleSelectShift}>
        <td>{convertMilitaryTime(startTime)}</td>
        <td>{convertMilitaryTime(endTime)}</td>
      </tr>
    );
  }
}

export default Round;
