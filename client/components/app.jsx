import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MyInfo from './myinfo/myinfo';
import ShiftsWeek from './shifts/week/shifts-week';
import ShiftsDay from './shifts/day/shifts-day';
import ShiftsMonth from './shifts/month/shifts-month';
import ShiftsAvailable from './shifts/available/shifts-available';
import Login from './login/login';
import Welcome from './welcome/welcome';
import Modal from './post-modal';
import './post-modal.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      presetDateForTesting: 1563951600000,
      modals: [false, false]
      // modalShow: false
    }
  }

  // showModal = () => {
  //   this.setState({modalShow: true});
  // }

  // hideModal = () => {
  //   this.setState({ modalShow: false });
  // }
  toggleModal(modalToChange) {
    const modalCopy = this.state.modals.slice();
    modalCopy[modalToChange] = !modalCopy[modalToChange];
    this.setState({
      modals: modalCopy
    })
  }
  render(){
    return (
        <React.Fragment>
          <Switch>
          <Route path = "/login/" render={(props) => <Login {...props} />}/>
          <Modal open={this.state.modals[0]} closeCallback={this.toggleModal.bind(this, 0)}> Modal content aw yeah! </Modal>
          <Modal open={this.state.modals[1]} closeCallback={this.toggleModal.bind(this, 1)}>
            <h4>Aw</h4>
            <h2>Yes</h2>
          </Modal>
            <Route exact path = {['/','/welcome/']} render={(props) => <Welcome {...props}  />}/>
            <Route path = "/myinfo/" render={(props) => <MyInfo {...props} />}/>
            <Route path = "/shifts/week/shifts-week/:date?" render={(props) => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting}  />}/>
            <Route path = "/shifts/day/shifts-day/:date?" render={(props) => <ShiftsDay {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/month/shifts-month/:date?" render={(props) => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/available/" render={(props) => <ShiftsAvailable {...props} />}/>
          </Switch>
        </React.Fragment>
    );
  }
}

export default App;
