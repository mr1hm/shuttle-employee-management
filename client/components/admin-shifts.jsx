import React from 'react';
import TopMenuShift from './topmenu/topmenu-shift';
import HoursOfOperation from './shifts/week/hours-of-operation';
import RouteBusDisplay from '../components/route-bus-display';
import ShiftDisplayComponent from './shifts/week/shift-display-component';

class AdminShiftsDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shiftsAdmin: []
        }
    }

    componentDidMount() {
        fetch(`/api/dummy-data-assign-shifts.json`, {
            method: 'GET'
          })
            .then(response => {
              return response.json()
            })
            .then(myJson => {
              this.setState({
                shiftsAdmin: myJson
              })
            })
            .catch(error => {throw(error)});
    }

    // componentDidUpdate() {

    // }


    render() {
        const range = { min: 6, max: 24 };
        const startAndEndTimes = {start: this.state.shiftsAdmin.startTime, end: this.state.shiftsAdmin.endTime};
        if (startAndEndTimes === undefined) {
            return <div>no data available</div>;
        }
        var dateToPass = parseInt(this.props.defaultDate);

        console.log(this.state.shiftsAdmin);        
        return(
        <div>
            <TopMenuShift title="Admin" page='day' date={dateToPass}/>
            <HoursOfOperation />
            {
            this.state.shiftsAdmin.map(index => {
              return (
                < RouteBusDisplay
                  key={index}
                  bus={index.route}
                  route={index.line}
                />
              );
                })
            }

            {
            this.state.shiftsAdmin.map(index => {
              return (
                < ShiftDisplayComponent
                  key={index}
                  range={range}
                  shiftData={startAndEndTimes}

                />
              );
                })
            }
        
        </div>
        )
           
    }




}

export default AdminShiftsDay;