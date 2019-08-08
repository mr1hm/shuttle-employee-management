import React from 'react';
import './shifts-month.css'

class DayOfMonth extends React.Component {
  
renderDate(){

  if(this.props.shiftsArray.length !== 0){
      for(var shiftIndex=0; shiftIndex<this.props.shiftsArray.length; shiftIndex++){
        if(new Date(parseInt(this.props.shiftsArray[shiftIndex].shiftDate)).getDate() === this.props.dayIndex){

          switch(this.props.shiftsArray[shiftIndex].status){

            case "bothScheduledAndPosted":
                return (
                  <div>
                    <div class="calendarDay scheduled-shift-icon">
                      {this.props.dayIndex}
                    </div>
                  </div> 
                  );
            case "posted":
                return (
                  <div>
                    <div class="calendarDay posted-shift-icon">
                      {this.props.dayIndex}
                    </div>
                  </div> 
                  );
            case "scheduled":
                return (
                  <div>
                    <div class="calendarDay both-shift-icon">
                      {this.props.dayIndex}
                    </div>
                  </div> 
                  );
          }
        }
      }      
    }
    
    return (
      <div>
        <div class="calendarDay">
          {this.props.dayIndex}
        </div>
      </div> 
      );
}

  render() {
    return ( 
      <div>
        {this.renderDate()}
      </div>
    );
  } 
}


export default DayOfMonth;