import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import AdminShiftsDisplayComponent from './admin-shifts-display-component';
import './admin-shifts-display.css';

class AdminShiftsDay extends React.Component {
  constructor(props) {
    super(props);
    this.query = ``;
    this.fetchCallMethod = this.fetchCallMethod.bind(this);
    this.fetchAutoPopulatedData = this.fetchAutoPopulatedData.bind(this);
    // this.getAvailableDrivers = this.getAvailableDrivers.bind(this);
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = 1566273600; 
    this.state = {
      rounds: null,
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
  }

  //I don't think this approach will work.
  //The autopopulate takes awhile and it is pulling the round data too soon.
  //It's not noticing that anything has been updated, so the rounds array does not have the 
  //right information.
  fetchAutoPopulatedData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
    .then(() => {
      this.fetchCallMethod();
    })
    .catch(error => { throw (error) });
  }

  // getAvailableDrivers(){
  //   fetch(`/api/admin-available-drivers.php`, {
  //     method: 'GET'
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(myJson => {
  //       this.setState({
  //         availableOperators: myJson
  //       })
  //     })
  //     .catch(error => { throw (error) });
  // }

  // fetchCallMethod(query) {
  //   fetch(`/api/admin-day-shifts.php` + query, {
  //     method: 'GET'
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(myJson => {
  //       this.setState({
  //         rounds: myJson
  //       })
  //     })
  //     .catch(error => { throw (error) });
  // }

  fetchCallMethod() {
    fetch(`/api/admin-day-shifts.php`, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(myJson => {
        this.setState({ 
          rounds: myJson
        })
      })
      .catch(error => { throw (error) });
  }

  // componentDidMount() {
  //   this.fetchCallMethod(this.state.queryString);
  // }

  // dataDidUpdate(){
  //   this.fetchCallMethod(this.state.queryString);
  // }

  componentDidMount() {
    // this.fetchAutoPopulatedData();
    this.fetchCallMethod();
  }

  dataDidUpdate(){
    this.fetchCallMethod();
  }

  // //shutting off the query string for right now, until it is operating properly
  // componentDidMount() {
  //   this.fetchCallMethod();
  // }

  // dataDidUpdate(){
  //   // this.fetchCallMethod();
  // }


  //build array for a specific line and busNumber and sort by start time
  buildRoundsByLine(lineName, busNumber) {
    var roundsForLine = [];
    
    for( var roundsIndex = 0; roundsIndex < this.state.rounds.length; roundsIndex++) {
      if(this.state.rounds[roundsIndex]['line_name'] === lineName && this.state.rounds[roundsIndex]['bus_number'] === busNumber) {
        roundsForLine.push(this.state.rounds[roundsIndex]);
      }
    }
    roundsForLine.sort((a, b) => {
      return a.round_start - b.round_start;
    });
    console.log('rounds for line: ', roundsForLine);
    return roundsForLine;
  }

  //build an array of shifts for specific line and bus number
  buildShiftsByLine(lineName, busNumber) {
    var shiftsForLine = [];
    var endTime = null;
    var sortedLineAndBusArray = this.buildRoundsByLine(lineName, busNumber);
    console.log('sortedLineAndBusArray: ', sortedLineAndBusArray);
    var startTime = sortedLineAndBusArray[0].round_start;
    var userId = sortedLineAndBusArray[0].user_id;
    for (var indexSortedArray = 0;  indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      if(indexSortedArray === sortedLineAndBusArray.length - 1) {
        // console.log('inside last item')
        endTime = sortedLineAndBusArray[sortedLineAndBusArray.length - 1].round_end;
        console.log('end of array startTime: ', startTime);
        console.log('end of array endTime: ', endTime);
        console.log('end of array Index: ', indexSortedArray);
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
        break;
      } 
      if (sortedLineAndBusArray[indexSortedArray].user_id === userId) {
        console.log('inside continue')
        console.log('continue Index: ', indexSortedArray);        continue;
      } else {
        console.log('inside ELSE item')
        endTime = sortedLineAndBusArray[indexSortedArray - 1].round_end;
        console.log('mid section startTime: ', startTime);
        console.log('mid section endTime: ', endTime);
        console.log('mid section Index: ', indexSortedArray);
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
        startTime = sortedLineAndBusArray[indexSortedArray].round_start;
        userId = sortedLineAndBusArray[indexSortedArray].user_id;
      }
    }
    return shiftsForLine;
  }

  shiftsGroupedByLineAndBus() {
    // debugger;
    var busAndLineObject = {};
    var groupedShifts = [];
    // console.log(this.state.rounds);
    
    if (this.state.rounds) {
      for (var index = 0; index < this.state.rounds.length; index++) {
          var joinedLineAndBusNumber = this.state.rounds[index].line_name + this.state.rounds[index].bus_number;
          busAndLineObject[joinedLineAndBusNumber] = [this.state.rounds[index].line_name, this.state.rounds[index].bus_number];
      }
      //remove the duplicates that still remain in the busAndLineArray
      console.log('busAndLineObject: ', busAndLineObject);
      for (var key in busAndLineObject) {
        var lineName = busAndLineObject[key][0];
        var busNumber = busAndLineObject[key][1];  
        groupedShifts.push([lineName, busNumber, this.buildShiftsByLine(lineName, busNumber)]);
      }
      console.log(groupedShifts);
      return groupedShifts;      
    }
  }

  render() {
    console.log('rounds Array: ', this.state.rounds);
    var groupedArray = this.shiftsGroupedByLineAndBus();
    console.log('groupedArray: ', groupedArray);
    var range = { min: 600, max: 2400 };
    if (!this.state.rounds) {
      return <div>Retrieving Data</div>;
    } else {
      return (
        <div>
              {/* <div className="dropdown">
                <button onClick={this.getAvailableDrivers} className="dropbtn">Available Drivers</button>
                <div className="dropdown-content">
                    {fullName.map((index) => {
                      return (
                        <a href="#">{index}</a>
                      )
                    })}
                </div>
              </div> */}
              
          <TopMenuShift title="Admin" page='day' date={this.state.dateToPass} />
          <button onClick={this.fetchAutoPopulatedData}> AUTO POPULATE </button>
          <div className="viewHoursContainer">
            <HoursOfOperation />
          </div>
          <div className="adminShiftsDayView">
            {groupedArray.map((element, index) => {
              return (
                <div className="dayDataContainer" key={index}>
                  <div className="dayLabelContainer">
                    <div className="adminShiftsDayBusLine">
                      < RouteBusDisplay
                        // key={index} 
                        bus={element[1]}  //bus number
                        route={element[0]} //line letter
                      /> 
                    </div> 
                </div> 
                <div className="shiftRowContainer"> 
                    < AdminShiftsDisplayComponent
                      // key={index}
                      range={range}
                      shiftData={{start: 600, end: 2400}}
                      children={element[2]}
                      type={'alertShift'}
                    />
                  </div>
                </div>
              ) 
              })}
          </div>
        </div>
      )
    }
  }
}
export default AdminShiftsDay;

