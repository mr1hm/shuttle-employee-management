import React from 'react';

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="container" style={{ top: "5%", left: "80%", position: "absolute" }}>
          <div className= "row " >Shifts</div>
        </div> */}

        <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
          <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >MY INFO</div>
        </div>
      </React.Fragment>

    );
  }
}
export default MyInfo;
