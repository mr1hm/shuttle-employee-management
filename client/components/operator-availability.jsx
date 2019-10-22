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

  buildBlock(day) {
    return(
      this.state.availability[day].map((element, index) => {
        if(element) {
          return <td key={index} style={{backgroundColor: 'green', width: '1.355%', height: '10vh', border: '1px solid black'}}></td>
        } else {
          return <td key={index} style={{backgroundColor: 'lightgrey', width: '1.355%', height: '10vh', border: '1px solid black'}}></td>
        }
      })
    );
  }

  render() {
    const divStyle = {width: '2.5vw', height: '10vh', borderWidth: '1px'}; 
    const divDay = {width: '2.5vw', height: '10vh', borderWidth: '1px'}; 

    return (
        <React.Fragment>
          <TopMenuGeneral title="MY AVAILABILITY"/>
          <div className="d-flex">
          <div style={{width: '5%'}}></div>
          <table className="mt-5 mr-0" style={{width: '90%'}}>
            <thead className="container">
              <tr className="row d-flex justify-content-end"> 
                <th style={{width: '2.8%', height: '5vh', border: '1px solid black'}}>Day</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>6 am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>7am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>8am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>9am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>10am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>11am</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>12pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>1pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>2pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>3pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>4pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>5pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>6pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>7pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>8pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>9pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>10pm</th>
                <th style={{width: '5.4%', height: '5vh', border: '1px solid black'}}>11pm</th>
              </tr>
            </thead>
            <tbody className="container">
              <tr className="row d-flex justify-content-end">
                <td className= "align-middle" style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Sun</td>
                {this.buildBlock('Sunday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Mon</td>
                {this.buildBlock('Monday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Tue</td>
                {this.buildBlock('Tuesday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Wed</td>
                {this.buildBlock('Wednesday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Thu</td>
                {this.buildBlock('Thursday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Fri</td>
                {this.buildBlock('Friday')}
              </tr>
              <tr className="row d-flex justify-content-end">
                <td style={{backgroundColor: 'white', width: '2.8%',  heigth: '10vh', border: '1px solid black'}}>Sat</td>
                {this.buildBlock('Saturday')}
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
