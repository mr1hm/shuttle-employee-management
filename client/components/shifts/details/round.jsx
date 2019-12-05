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
    const { id } = this.state;
    const idInt = parseInt(id);
    const idBeforeGivenId = JSON.stringify(idInt - 1);
    const idAfterGivenId = JSON.stringify(idInt + 1);
    const alreadySelectedIds = this.props.checkedRounds;
    if (alreadySelectedIds.includes(idBeforeGivenId) || alreadySelectedIds.includes(idAfterGivenId) || alreadySelectedIds.length === 0 || alreadySelectedIds.includes(id)) {
      this.setState({ clicked: !this.state.clicked });
      this.props.selectShift(id);
    } else {
      this.props.selectShift(id);
    }
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
