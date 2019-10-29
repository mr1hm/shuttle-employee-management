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

    render() {
        const range = { min: 6, max: 24 };
        const dateToPass = parseInt(this.props.defaultDate);

        return(
        <div>
            <TopMenuShift title="Admin" page='day' date={dateToPass}/>
            <div className="viewHoursContainer">
                <HoursOfOperation />
            </div>
            <div className="adminShiftsDayView">
              {this.state.shiftsAdmin.map((index) => {
                return (
                    <div className="dayDataContainer">
                        <div className="dayLabelContainer">
                            < RouteBusDisplay
                            key={index}
                            bus={index.route}
                            route={index.line}
                            />
                        </div>
                        <div className="shiftRowContainer">
                            < ShiftDisplayComponent
                            key={index}
                            range={range}
                            shiftData={{start: index.startTime/100, end: index.endTime/100}}
                            children={index.alert}
                            type={'active'}
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
export default AdminShiftsDay;
