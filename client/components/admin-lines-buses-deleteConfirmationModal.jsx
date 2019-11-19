import React from 'react';
import Lines from './admin-lines-buses-lines';

export default class DeleteConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: null
    };
  }

  // deleteLine(lineID, sessionID) {
  //   let busIDArr = [];
  //   let busIDs = this.props.line.activeBuses.forEach(buses => { // another bug. if deleting line from All Sessions tab, it will get/render all the lines from only that session.
  //     busIDArr.push(buses.busID); // DELETES BUS AS WELL - IT WORKS!!d
  //   });
  //   console.log(busIDArr);
  //   const body = {
  //     routeID: lineID,
  //     buses: busIDArr
  //   };
  //   const init = {
  //     method: 'DELETE',
  //     body: JSON.stringify(body)
  //   };
  //   fetch('api/admin-lines-buses.php', init)
  //     .then(response => response.json())
  //     .then(deletedLine => {
  //       this.setState({
  //         deletedLineName: this.props.line.line_name // not working
  //       });
  //       if (this.props.currentSession === 'All Sessions') {
  //         this.props.getLinesBusesInfo();
  //       } else {
  //         this.props.getLinesBusesInfo({ session_id: sessionID });
  //       }
  //       this.props.operationsHistoryMethod();
  //     })
  //     .catch(error => console.error(error));
  //   console.log('LINE DELETED');
  // }



  render() {
    const {line } = this.props;
    return (
      <div className="container deleteConfirmationModal">
        <div className="row">
          <div className="col">
    <h3>Are you sure you want to delete Line {this.props.line.line_name}?</h3>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button onClick={() => this.props.deleteLine(line.real_route_id)}>Confirm</button>
          </div>
          <div className="col">
            <button onClick={this.handleDeleteLine}>Cancel</button>
          </div>
        </div>

      </div>
    );
  }
}
