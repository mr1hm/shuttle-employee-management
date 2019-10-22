import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';
import './welcome.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newShiftsandSelectedDriver: ''
    };
  }
  componentDidMount() {
    const newShiftsandSelectedDriver = this.props.location.state;
    this.setState({
      newShiftsandSelectedDriver: newShiftsandSelectedDriver
    });
  }
  render() {
    return (
      <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg">
        <TopMenuGeneral title="WELCOME" newShiftsandSelectedDriver={this.state.newShiftsandSelectedDriver} />
        <div className="col-md-5 p-lg-5 mx-auto my-5 bg-ae-blue">
          <kbd className="display-4 font-weight-normal bg-transparent">VERMINLINGUA EXPRESS</kbd>
        </div>
        <p >Vermilingua Express is a University's campus bus system. Our website is the shift scheduling platform for student drivers and administrators. It lets the drivers read, add, remove, trade, and swap desired shifts. Administrators are able to set up initial shifts and accept ordeny changes requested by drivers.</p>
      </div>
    );
  }

}

export default Welcome;
