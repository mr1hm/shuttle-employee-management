import React from 'react';

class DayOfMonth extends React.Component {
  
  render() {
    if(this.props.shiftsArray.length !== 0){

      for(var shiftIndex=0; shiftIndex<this.props.shiftsArray.length; shiftIndex++){
        if(new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate() === this.props.dayIndex){

          switch(this.props.shiftsArray[shiftIndex].status){

            case "posted":
              console.log('a shift has been posted for', new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate());
              break;
            case "scheduled":
              console.log('a shift has been scheduled for', new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate());
              break;
            case "bothScheduledAndPosted":
              console.log('a shift has been scheduled and posted for', new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate())
          }
        }
      }

      return (
        <div class={this.props.today}>
          {this.props.dayIndex}
          <div class={this.props.shifts}>{console.log(this.props.shiftsArray[0].status)}</div>
        </div>
      );
    } 
    return ( 
      <div class={this.props.today}>
        {this.props.dayIndex}
      </div>
    );
  } 
}

export default DayOfMonth;