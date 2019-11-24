import React from 'react';

export default class MasterFieldStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allData: null
    }
  }

  render() {
    const { linesBusesInfo } = this.props.location.state;
    const { sessions } = this.props.location.state;
    return (
      <div className="container-fluid">
        <header>
          <div className="row liveFieldStatusHeader">
            <div className="col">
              <img src="../../server/public/assets/images/mascot/anteater.png" alt="anteater mascot" />
              <h3>Anteater<br /> Express</h3>
            </div>
          </div>
        </header>
        <div className="container liveFieldStatusContentContainer">
          <div className="row">
            <div className="col d-inline-flex">
              <h1 className="liveFieldStatusTitle">Master Field Status</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-center">
              <h2 className="liveFieldStatusSessionName">Fall 2019</h2>
            </div>
          </div>
        </div>
        <div className="container liveFieldStatusTableContainer">
          <div className="row">
            <table className="table liveFieldStatusTable">
              <thead>
                <tr>
                  <th scope="col">Line</th>
                  <th scope="col">Bus Number</th>
                  <th scope="col">Vehicle</th>
                  <th scope="col">Current Shift</th>
                </tr>
              </thead>
              <tbody>
                {linesBusesInfo.map(lineBusData => {
                  let activeBusesLength = lineBusData.activeBuses.length;
                  let lineName = lineBusData.line_name;
                  return (
                    <>
                      {lineBusData.activeBuses.map((bus, index) => {
                        return (
                          <tr>
                            <td>{lineBusData.line_name}</td>
                            <td>{bus.busNumber}</td>
                            <td>{bus.vehicleID}</td>
                            <td>Shift Time & Operator Name</td>
                          </tr>
                        );
                      })}
                    </>
                  );
                })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
