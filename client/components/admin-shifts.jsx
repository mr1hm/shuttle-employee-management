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
    this.dataDidUpdate = this.dataDidUpdate.bind(this);
    const defaultDate = 1566273600; 
    this.state = {
      rounds: null,
      availableOperators: [],
      queryString: `?date=${defaultDate}`,
      dateToPass: defaultDate
    }
  }
  //updating the db with the autopopulated rounds
  fetchAutoPopulatedData() {
    fetch(`/api/admin-populate-rounds.php`, {
      method: 'POST'
    })
    .then(() => {
      this.fetchCallMethod();
    })
    .catch(error => { throw (error) });
  }
 
  //getting rounds after autopopulation complete
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

  componentDidMount() {
    this.fetchCallMethod();
  }
  dataDidUpdate(){
    this.fetchCallMethod();
  }

  //build array for a specific line and busNumber and sort by start time
  buildRoundsByLine(lineName, busNumber) {
    var roundsForLine = [];
    
    for( var roundsIndex = 0; roundsIndex < this.state.rounds.length; roundsIndex++) {
      if(this.state.rounds[roundsIndex]['line_name'] === lineName && this.state.rounds[roundsIndex]['bus_number'] === busNumber) {
        roundsForLine.push(this.state.rounds[roundsIndex]);
      }
    }
    return roundsForLine;
  }
  //build an array of shifts for specific line and bus number
  buildShiftsByLine(lineName, busNumber) {
    var shiftsForLine = [];
    var endTime = null;
    var sortedLineAndBusArray = this.buildRoundsByLine(lineName, busNumber);
    var startTime = sortedLineAndBusArray[0].round_start;
    var userId = sortedLineAndBusArray[0].user_id;
    for (var indexSortedArray = 1;  indexSortedArray < sortedLineAndBusArray.length; indexSortedArray++) {
      if(indexSortedArray === sortedLineAndBusArray.length - 1) {
        // console.log('inside last item')
        endTime = sortedLineAndBusArray[sortedLineAndBusArray.length - 1].round_end;
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
        break;
      } 
      if (sortedLineAndBusArray[indexSortedArray].user_id === userId) {     
        continue;
      } else {
        endTime = sortedLineAndBusArray[indexSortedArray - 1].round_end;
        shiftsForLine.push({'start_time': startTime, 'end_time': endTime, 'user_id': userId});
        startTime = sortedLineAndBusArray[indexSortedArray].round_start;
        userId = sortedLineAndBusArray[indexSortedArray].user_id;
      }
    }
    return shiftsForLine;
  }
  shiftsGroupedByLineAndBus() {
    var busAndLineObject = {};
    var groupedShifts = [];
    
    if (this.state.rounds) {
      for (var index = 0; index < this.state.rounds.length; index++) {
          var joinedLineAndBusNumber = this.state.rounds[index].line_name + this.state.rounds[index].bus_number;
          busAndLineObject[joinedLineAndBusNumber] = [this.state.rounds[index].line_name, this.state.rounds[index].bus_number];
      }
      //remove the duplicates that still remain in the busAndLineArray
      for (var key in busAndLineObject) {
        var lineName = busAndLineObject[key][0];
        var busNumber = busAndLineObject[key][1];  
        groupedShifts.push([lineName, busNumber, this.buildShiftsByLine(lineName, busNumber)]);
      }
      return groupedShifts;      
    }
  }
  render() {
    var groupedArray = this.shiftsGroupedByLineAndBus();
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
                        bus={element[1]}  //bus number
                        route={element[0]} //line letter
                      /> 
                    </div> 
                </div> 
                <div className="shiftRowContainer"> 
                    < AdminShiftsDisplayComponent
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





