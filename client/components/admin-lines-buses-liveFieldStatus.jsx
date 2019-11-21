import React from 'react';
import Random from '../../server/public/assets/images/mascot/'

export default class LiveFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldStatus: null
    };
  }

  render() {
    return (
      <div className="container-fluid">
        <header>
          <div className="row">
            <div className="col-2">
              <img src="../../server/public/assets/images/mascot/anteater.png" alt="anteater mascot"/>
              <h4>Anteater<br /> Express</h4>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="liveFieldStatusTitle">Live Field Status</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
