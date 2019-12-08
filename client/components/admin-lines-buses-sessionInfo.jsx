import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default class SessionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionInfo: null,
      selectedSessionID: null,
      currentSessionInfo: null
    };
    // this.getSessionInfo = this.getSessionInfo.bind(this);
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

  findCurrentSession() {
    const { sessionData, selectedSessionID } = this.state;
    // const currentSessionInfo = sessionData.find(session => selectedSessionID === sessionData.id);
  }

  render() {
    const { sessionData } = this.state;
    const { sessionSelected, selectedSessionID } = this.props;
    if (!this.props.selectedSessionID) return <div>Please select a session to see details</div>;
    return (
      <div className="row">
        <div className="col">
          <span>Current Session: {}</span>
        </div>
      </div>
    );
  }
}
