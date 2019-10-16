import React from 'react';
import './tranaction.css';
import TopMenuGeneral from '../topmenu/topmenu-general';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    console.log("tran", this.props);
    this.state = {
      editButton: false,
      userInfo: [],
      userId: null,
      cellProvider: []
    }
  }


  render() {
      return (
        <React.Fragment>
          <TopMenuGeneral title="Transaction Log" />
          <div className="row-fluid">
            <div className="span2 offset1">1</div>
            <div className="span2">2</div>
            <div className="span2">3</div>
            <div className="span2">4</div>
            <div className="span2">5</div>
          </div>
          <div className="row">
            <div className="col-6">Shirt Size</div>
            <select className="col-6 mb-2 editInput" placeholder="Shirt Size" type="text" name="shirtSize">
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
        </React.Fragment>
      );
    }
}

export default Transaction;
