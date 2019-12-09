import React from 'react';
import { Switch, Route } from 'react-router-dom';
import * as auth from '../hoc/auth_config';
import onAuthRedirect from '../hoc/on_auth_redirect';
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
import AdminUserSummary from './admin-user-summary';
import LiveFieldStatus from './admin-lines-buses-liveFieldStatus';
import MasterSchedule from './admin-lines-buses-master-schedule';
import NotFound from './errors/not_found';

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
    return (
      <Switch>
        <Route exact path={['/', '/login']} component={onAuthRedirect(Login, '/welcome')} />
        <Route path="/admin-day" component={auth.all(AdminShiftsDay, {
          defaultDate: this.state.presetDateForTesting
        })} />
        <Route path="/admin-routes" component={auth.all(AdminRoutes, {
          defaultDate: this.state.presetDateForTesting
        })} />
        <Route path="/admin-operator-availability" component={auth.all(AdminOperatorAvailability)} />
        <Route path="/admin-user-summary" component={auth.all(AdminUserSummary)} />
        <Route path="/welcome" component={auth.any(Welcome, {}, '/login')} />
        <Route path="/live-field-status" component={auth.operations(LiveFieldStatus, {}, '/welcome')} />
        <Route path="/master-schedule" component={auth.all(MasterSchedule)} />
        <Route path="/my-info" component={auth.all(MyInfo)} />
        <Route path="/operator-availability" component={auth.all(OperatorAvailability)} />
        <Route path="/shifts/available/:date" component={auth.all(ShiftsAvailable)} />
        <Route path="/shifts/day/shifts-day/:date" component={auth.all(ShiftsDay)} />
        <Route path="/shifts/details" component={auth.all(ShiftsDetails, {
          date: this.state.date,
          shiftId: this.state.shiftId,
          queryString: this.state.queryString,
          startSwapTradeTransaction: this.startSwapTradeTransaction
        })} />
        <Route path="/shifts/month/shifts-month/:date" component={auth.all(ShiftsMonth)} />
        <Route path="/shifts/week/shifts-week/:date" component={auth.all(ShiftsWeek)} />
        <Route path="/trade-notifications" component={auth.all(TradeNotification, {
          shiftDetails: this.state.shiftDetails
        })} />
        <Route path="/trade-swap" component={auth.all(TradeSwap, {
          shiftDetails: this.state.shiftDetails
        })} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default App;
