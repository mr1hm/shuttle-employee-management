import React from 'react';
import TopMenuGeneral from '../components/topmenu/topmenu-general';
import './admin-operator-availability.css';

class AdminOperatorAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operatorDetails: null,
      sessionId: 1
    };
    this.getOperatorDetails = this.getOperatorDetails.bind(this);
  }

  componentDidMount() {
    this.getOperatorDetails();
  }

  getOperatorDetails() {
    const data = {
      method: 'POST',
      body: JSON.stringify({
        'session_id': this.state.sessionId
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/admin-operator-availability.php`, data)
      .then(response => response.json())
      .then(data => {
        this.setState({
          operatorDetails: data
        });
      })
      .catch(error => { throw (error); });
  }

  submittedStatus(index) {
    const defaultStyles = {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      margin: '0 auto'
    };

    const style = {
      backgroundColor: undefined
    };

    (index['submitted']) ? style.backgroundColor = 'green' : style.backgroundColor = 'red';

    return (
      <div style={{ ...defaultStyles, ...style }}></div>
    );
  }

  render() {
    if (!this.state.operatorDetails) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <TopMenuGeneral title="ADMIN-OPERATOR AVAILABILITY" />
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>User Id</th>
              <th></th>
              <th style={{ textAlign: 'center' }}>Last Name</th>
              <th></th>
              <th style={{ textAlign: 'center' }}>First Name</th>
              <th></th>
              <th style={{ textAlign: 'center' }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.operatorDetails.map(index => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index['id']}</td>
                    <td></td>
                    <td style={{ textAlign: 'center' }}>{index['last_name']}</td>
                    <td></td>
                    <td style={{ textAlign: 'center' }}>{index['first_name']}</td>
                    <td></td>
                    <td>{this.submittedStatus(index)}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default AdminOperatorAvailability;
