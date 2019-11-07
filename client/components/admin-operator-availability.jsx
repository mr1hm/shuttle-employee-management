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

  submittedStatus(operator) {
    const defaultStyles = {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      margin: '0 auto'
    };

    const colorStyle = {
      backgroundColor: undefined
    };

    (operator['submitted']) ? colorStyle.backgroundColor = 'green' : colorStyle.backgroundColor = 'red';

    return (
      <div style={{ ...defaultStyles, ...colorStyle }}></div>
    );
  }

  render() {
    if (!this.state.operatorDetails) {
      return <div>No Data Available</div>;
    }
    return (
      <React.Fragment>
        <div className='nav'>
          <TopMenuGeneral title="ADMIN-OPERATOR AVAILABILITY" />
        </div>
        <table className= 'mt-4'>
          <thead>
            <tr>
              <th>User Id</th>
              <th></th>
              <th >Last Name</th>
              <th></th>
              <th>First Name</th>
              <th></th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.operatorDetails.map((operator, index) => {
                return (
                  <tr key={index}>
                    <td>{operator['id']}</td>
                    <td></td>
                    <td>{operator['last_name']}</td>
                    <td></td>
                    <td>{operator['first_name']}</td>
                    <td></td>
                    <td>{this.submittedStatus(operator)}</td>
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
