import React from 'react';
import './editBusModal.css';

export default class EditBusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busInfo: null
    }
  }

  componentDidMount() {
    fetch('api/admin-lines-buses.php?id=${this.props.busID}')
      .then(response => response.json())
      .then(busInfo => this.setState({
        busInfo: busInfo
      }))
      .catch(error => console.error(error));
  }

  render() {
    if (!this.props.showModal) {
      return null;
    }
    return (
      <>
        <div className="container">
          {this.props.children}
          <div className="row">
            <div className="offset-11 col d-flex justify-content-end">
              <button onClick={() => this.props.onClose()} className="closeModal btn btn-danger">X</button>
            </div>
          </div>
          <div className="row editRow">
            {/* edit row goes here */}
          </div>
          <div className="row">
            <div className="offset-11 col d-flex justify-items-end">
              <button className="saveChangesBtn btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </>
      );
    }
  }
