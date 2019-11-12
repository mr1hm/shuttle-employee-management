import React from 'react';
import { Link } from 'react-router-dom';

class StrictNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="modal fade show" style={{ display: 'block' }} id="StrictNotification" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row text-center justify-content-center">
                <div className="col-3">
                  <h1>Please Submit Your Availability </h1>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <Link to= {{
                  pathname: '/operator-availability/',
                  state: {
                    operatorFlag: 1
                  }
                }}
                className="btn btn-primary" >Go to My Availability</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default StrictNotification;
