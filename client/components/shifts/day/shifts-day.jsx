import React from 'react';
import { Link } from 'react-router-dom';
import {
  createDateObjFromDateString,
  convertUnixMonthDay,
  adjustLocalTimestampToUTCSeconds
} from '../../../lib/time-functions';
import TopMenuShift from '../../topmenu/topmenu-shift';
import SingleShift from './single-shift';

class ShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = this.props.match.params.date ? createDateObjFromDateString(this.props.match.params.date).getTime() : parseInt(this.props.defaultDate);// converts unix time to date/at midnight 09/17/2019
    const defaultId = this.props.userId;
    this.state = {
      shifts: [],
      queryString: `?date=${adjustLocalTimestampToUTCSeconds(defaultDate)}&userID=${defaultId}&type=myShifts`,
      dateToPass: defaultDate,
      userId: this.props.userId
    };
  }
  getShifts(query) {
    const response = fetch(`/api/shifts-day.php` + query, {
      method: 'GET'
    });

    response
      .then(response => response.json())
      .then(json => this.setState({ shifts: json }))
      .catch(error => { console.error(error); });
  }
  componentDidMount() {
    this.getShifts(this.state.queryString);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.date !== this.props.match.params.date || this.props.view !== prevProps.view) {
      let dateToQuery = createDateObjFromDateString((this.props.match.params.date ? this.props.match.params.date : this.state.dateToPass)).getTime();// converts unix time to date/at midnight 09/17/2019
      this.setState({
        dateToQuery: adjustLocalTimestampToUTCSeconds(dateToQuery),
        queryString: `?date=${adjustLocalTimestampToUTCSeconds(dateToQuery)}&userID=${this.state.userId}&type=${this.props.view || 'myShifts'}`,
        dateToPass: this.props.match.params.date
      });
      this.getShifts(`?date=${adjustLocalTimestampToUTCSeconds(dateToQuery)}&userID=${this.state.userId}&type=${this.props.view || 'myShifts'}`);
    }
  }
  dataDidUpdate() {
    this.getShifts(this.state.queryString);
  }
  render() {
    let dateToPass = this.state.dateToPass;
    dateToPass = createDateObjFromDateString(dateToPass);// converts unix time to date/at midnight 09/17/2019

    if (!this.state.shifts.length) {
      return (
        <>
          <TopMenuShift title="DAY" page='day' userId={this.props.userId} date={dateToPass} />
          <div className="container mt-5">
            <div className="row">
              <div className="col text-center">
                <h3>You have no shifts scheduled today.</h3>
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
        <>
          <Link to={`/shifts/day/shifts-day/${convertUnixMonthDay(this.state.dateToPass)}`}> </Link>
          <TopMenuShift userId={this.props.userId} title={this.props.view === 'myShifts' ? 'DAY' : 'AVAILABLE'} page='day' date={(dateToPass)} />
            <table className='table table-striped text-center'>
              <thead>
                <tr>
                  <th>Line/#</th>
                  <th>Start-End</th>
                  <th>Rounds</th>
                  <th>Shift Hours</th>
                  <th>Post Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.shifts.map((shifts, index) => {
                    return (
                      < SingleShift
                        key={index}
                        shifts={shifts}
                        view={this.props.view}
                        queryString={this.state.queryString}
                        openRouteDetails={this.props.openRouteDetails}
                      />
                    );
                  })
                }
              </tbody>
            </table>
        </>
    );
  }
}

export default ShiftsDay;
