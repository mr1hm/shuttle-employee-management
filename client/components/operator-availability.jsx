import React from 'react';
import TopMenuGeneral from './topmenu/topmenu-general';

//dummy data only right now (not connected to endpoint)
class OperatorAvailability extends React.Component {
  constructor(props) {
    super(props); 
    this.state = { 
       availability: {
        'Sunday': [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        'Monday': [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        'Tuesday': [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        'Wednesday': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        'Thursday': [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        'Friday': [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        'Saturday': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      }
    }
  }

  buildDayCell(day) {
    return(
      this.state.availability[day].map((element, index) => {
        if(element) {
          return <td key={index} style={{backgroundColor: 'green', width: '1.35%', height: '10vh', border: '1px solid black'}}></td>
        } else {
          return <td key={index} style={{backgroundColor: 'lightgrey', width: '1.35%', height: '10vh', border: '1px solid black'}}></td>
        }
      })
    );
  }

  buildHeaderTimes() {
    const headerTimes = ['6am', '7am', '8am', '9am', '10am','11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm','11pm'];

    return(
    headerTimes.map((element,index) => {
      return <th key={index} style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>{element}</th>
    })
    );
  }

  render() {
    return (
        <React.Fragment>
          <TopMenuGeneral title="MY AVAILABILITY"/>
          <div className="d-flex">
            <div style={{width: '5%'}}></div>
            <table className="mt-5 mr-0" style={{width: '90%'}}>
              <thead className="container">
                <tr className="row d-flex justify-content-end"> 
                  <th style={{width: '2.8%', height: '5vh', border: '1px solid black'}}>Day</th>
                  {this.buildHeaderTimes()}
                </tr>
              </thead>
              <tbody className="container">
                <tr className="row d-flex justify-content-end">
                  <td className= "align-middle" style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Sun</td>
                  {this.buildDayCell('Sunday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Mon</td>
                  {this.buildDayCell('Monday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Tue</td>
                  {this.buildDayCell('Tuesday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Wed</td>
                  {this.buildDayCell('Wednesday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Thu</td>
                  {this.buildDayCell('Thursday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Fri</td>
                  {this.buildDayCell('Friday')}
                </tr>
                <tr className="row d-flex justify-content-end">
                  <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Sat</td>
                  {this.buildDayCell('Saturday')}
                </tr>
              </tbody>         
            </table>
            <div style={{width: '5%'}}></div>
          </div>
        </React.Fragment>
    );
  }
}



export default OperatorAvailability;
