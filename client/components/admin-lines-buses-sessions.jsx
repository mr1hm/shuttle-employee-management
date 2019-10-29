import React from 'react';

export default class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: this.props.allSessions
    }
  }

  render() {
    return (
      <option>{this.props.sessionData.name}</option>
    );
  }
}
