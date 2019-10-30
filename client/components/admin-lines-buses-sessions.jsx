import React from 'react';

export default class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionID: this.props.sessionData.id
    };
  }

  render() {
    return (
      <option>{this.props.sessionData.name}</option>
    );
  }
}
