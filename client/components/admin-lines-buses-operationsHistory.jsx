import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default class OperationsHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operationsHistory: [],
      fullData: [],
      sessionData: []
    };
    this.storeOperationsHistory = this.storeOperationsHistory.bind(this);
  }

  componentDidMount() {
    // this.props.getStoreOperationsHistoryMethod(this.storeOperationsHistory);
    this.copyOriginalLinesBusesInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.linesBusesInfo !== this.props.linesBusesInfo) {
      this.storeOperationsHistory();
    }
  }

  copyOriginalLinesBusesInfo() {
    fetch(`api/admin-lines-buses.php`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          fullData: data
        });
      });
  }

  storeOperationsHistory() {
    const originalData = this.props.linesBusesInfo.slice();
    console.log(originalData);
    let deleteHistory = [];
    if (originalData.length !== this.props.linesBusesInfo.length) {
      originalData.forEach(item1 => {
        this.props.linesBusesInfo.forEach(item2 => {
          if (item1 !== item2) {
            deleteHistory.push(item1);
          }
        });
      });
    }
    this.setState({
      operationsHistory: deleteHistory
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <FontAwesomeIcon className="operationsHistoryDeleteIcon" icon={faMinusCircle} />Deleted Line Pi
          <br />
          <FontAwesomeIcon className="operationsHistoryAddIcon" icon={faPlusCircle} />Added Line Pi
        </div>
      </div>
    );
  }
}
