import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MyInfo from './myinfo/myinfo';
import ShiftsWeek from './shifts/week/shifts-week';
import ShiftsDay from './shifts/day/shifts-day';
import ShiftsMonth from './shifts/month/shifts-month';
import ShiftsAvailable from './shifts/available/shifts-available';
import ShiftsDetails from './shifts/details/shifts-details';
import Login from './login/login';
import Welcome from './welcome/welcome';
import OperatorAvailability from './operator-availability';
import AdminOperatorAvailability from './admin-operator-availability';
import AdminShiftsDay from './admin-shifts';
import AdminRoutes from './admin-lines-buses';
import Transaction from './transaction/transactionpage';
import TradeSwap from './trade-swap';
import TradeNotification from './trade-notification';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLogin: false,
      userId: [],
      shiftId: null,
      presetDateForTesting: 1560409200000
    };
    this.setLoginProps = this.setLoginProps.bind(this);
    this.getUserID = this.getUserID.bind(this);
    this.startSwapTradeTransaction = this.startSwapTradeTransaction.bind(this);
    this.openRouteDetails = this.openRouteDetails.bind(this);
  }

  getUserID() {
    return this.state.userId;
  }

  setLoginProps(userIdNumber) {
    this.setState({
      userId: userIdNumber,
      userLogin: true
    });
  }
  startSwapTradeTransaction(shiftDetails) {
    this.setState({ shiftDetails: shiftDetails });
  }
  openRouteDetails(id, date) {
    this.setState({ shiftId: id, date: date });
  }
  render() {
    const today = new Date();
    const dateString = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
    console.log('app: ', dateString);
    const userStateId = parseInt(this.state.userId);
    if (this.state.userLogin === true) {
      return (
        <React.Fragment>
          <Switch>
            <Route exact path={['/', '/welcome/']} render={props => <Welcome {...props} userId={this.state.userId ? this.state.userId : 17} />} />
            <Route path="/myinfo/" render={props => <MyInfo {...props} userId={this.state.userId ? this.state.userId : 17} get={this.getUserID} />} />
            <Route path="/shifts/week/shifts-week/:date?" render={props => <ShiftsWeek userId={this.state.userId ? this.state.userId : 17} {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/day/shifts-day/:date?" render={props => <ShiftsDay openRouteDetails={this.openRouteDetails} {...props} userId={this.state.userId ? this.state.userId : 17} view="myShifts" defaultDate={this.state.presetDateForTesting} />} />
            <Route path={`/shifts/month/shifts-month/:date`} render={props => <ShiftsMonth userId={this.state.userId ? this.state.userId : 17} {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/available/:date?" render={props => <ShiftsDay userId={this.state.userId ? this.state.userId : 17} {...props} view="availableShifts" defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/shifts/details/" render={props => <ShiftsDetails {...props} userId={this.state.userId} date={this.state.date} shiftId={this.state.shiftId} queryString={this.state.queryString} startSwapTradeTransaction={this.startSwapTradeTransaction} />} />
            <Route path="/admin-day/" render={props => <AdminShiftsDay userId={this.state.userId ? this.state.userId : 17} {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/operator-availability/" render={props => <OperatorAvailability userId={this.state.userId ? this.state.userId : 17} />} />
            <Route path="/admin-operator-availability/" render={props => <AdminOperatorAvailability userId={this.state.userId ? this.state.userId : 17} />} />
            <Route path="/trade-swap/" render={props => <TradeSwap {...props} shiftDetails={this.state.shiftDetails} />} />
            <Route path="/trade-notification/" render={props => <TradeNotification {...props} userId={this.state.userId ? this.state.userId : 17} shiftDetails={this.state.shiftDetails} />} />
          </Switch>
        </React.Fragment>
      );
    }
    if (this.state.userLogin === false) {
      return (
        <React.Fragment>
          <Switch>
            <Route exact path={['/', '/login/']} render={props => <Login {...props} onClick={this.setLoginProps} onChange={this.getUserID} />} />
            <Route path="/welcome/" render={props => <Welcome {...props} />}/>
            <Route path="/myinfo/" render={props => <MyInfo {...props} userId={this.state.userId} />}/>
            <Route path = "/shifts/week/shifts-week/:date?" render={props => <ShiftsWeek {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/day/shifts-day/:date?" render={props => <ShiftsDay {...props} view="myShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path={`/shifts/month/shifts-month/:date`} render={props => <ShiftsMonth {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path= "/shifts/available/:date?" render = {props => <ShiftsDay {...props} view="availableShifts" defaultDate={this.state.presetDateForTesting} />}/>
            <Route path = "/shifts/details/" render={props => <ShiftsDetails {...props} />}/>
            <Route path = "/admin-day/" render={props => <AdminShiftsDay {...props} defaultDate={this.state.presetDateForTesting} />}/>
            <Route path="/admin-routes/" render={props => <AdminRoutes {...props} defaultDate={this.state.presetDateForTesting} />} />
            <Route path="/operator-availability/" render={props => <OperatorAvailability {...props}/>}/>
            <Route path="/admin-operator-availability/" render={props => <AdminOperatorAvailability {...props}/>}/>
            <Route path="/trade-swap/" render={props => <TradeSwap {...props}/>} />
          </Switch>
        </React.Fragment>
      );
    }
  }
}

export default App;
