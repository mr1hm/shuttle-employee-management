import React from 'react';
import { convertMilitaryTime } from '../../../lib/time-functions';
import './round.css';

class Round extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      id: this.props.id,
      consecutiveModalFlag: 0
    };
    this.toggleSelectShift = this.toggleSelectShift.bind(this);
    this.toggleConsecutiveModal = this.toggleConsecutiveModal.bind(this);
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
      this.setState({ consecutiveModalFlag: 1 });
      this.props.selectShift(id);
    }
  }
  componentDidUpdate(prevProps, prevState) {
  }
  toggleConsecutiveModal() {
    this.setState({ consecutiveModalFlag: 0 });
  }
  render() {
    const className = this.state.clicked ? 'shift selected' : 'shift';
    const { startTime, endTime } = this.props;
    if (this.state.consecutiveModalFlag) {
      return (
        <div className="modal fade show" style={{ display: 'block' }} id="consecutiveCheckModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
              </div>
              <div className="modal-body">
                <div className="row text-center justify-content-center">
                  <div className="col-8">
                    <h3>Can only select consecutive shifts</h3>
                  </div>
                </div>
                <div className="modal-footer justify-content-center">
                  <button className="btn btn-primary" onClick={this.toggleConsecutiveModal} data-dismiss="modal">Ok</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <tr className={className} onClick={this.toggleSelectShift}>
        <td>{convertMilitaryTime(startTime)}</td>
        <td>{convertMilitaryTime(endTime)}</td>
      </tr>
    );
  }
}

export default Round;
