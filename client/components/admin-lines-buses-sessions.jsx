import React from 'react';

export default class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: null
    };
    this.getAllUpdatedSessions = this.getAllUpdatedSessions.bind(this);
  }

  componentDidMount() {
    this.getAllUpdatedSessions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allSessions !== this.props.allSessions) this.setState({ sessions: this.props.allSessions }, this.getAllUpdatedSessions);
  }

  getAllUpdatedSessions() {
    fetch('api/admin-lines-buses-sessions.php')
      .then(response => response.json())
      .then(sessions => {
        this.setState({ sessions });
      })
      .catch(error => console.error(error));
  }

  render() {
    const { sessions } = this.state;
    if (!sessions) return <div>LOADING...</div>;
    return (
      <>
      {sessions.map((session, index) => {
        return (
          <option key={session.name + index}>{session.name}</option>
        );
      })}
      </>
    );
  }
}
