import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default class SessionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionInfo: null,
      selectedSessionID: null
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedSessionID } = this.state;
    if (this.props.selectedSessionID !== prevProps.selectedSessionID) {
      this.setState({ selectedSessionID: this.props.selectedSessionID }, this.getSessionInfo);
    }
  }

  getSessionInfo() {
    const body = { sessionInfo: this.state.selectedSessionID };
    const init = { method: 'POST', body: JSON.stringify(body) };
    fetch(`api/admin-lines-buses-sessions.php`, init)
      .then(response => response.json())
      .then(sessionInfo => {
        console.log('getSessionInfo: ', sessionInfo);
        this.setState({ sessionInfo });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { sessionInfo } = this.state;
    if (!sessionInfo) return <div>Please select a session to see details</div>;
    return (
      <div className="row">
        <div className="col">
          <span>Current Session: {sessionInfo['1'].sessionName}</span>
        </div>
      </div>
    );
  }
}
