import React from 'react';
import TopMenuGeneral from '../topmenu/topmenu-general';

class MyInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <TopMenuGeneral title="MY INFO" />
        <div className="container" style={{ top: "40%", left: "40%", position: "absolute" }}>
          <div className="row d-inline" style={{ transform: "translate(-50%, -50%)" }} >MY INFO</div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyInfo;
