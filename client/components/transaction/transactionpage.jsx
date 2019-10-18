import React from 'react';
import './tranaction.css';
import TopMenuGeneral from '../topmenu/topmenu-general';
import { convertUnixMonthDay } from '../../lib/time-functions';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    console.log("tran", this.props);
    this.state = {
      editButton: false,
      transactionInfo: [],
      userId: null,
      cellProvider: []
    }
    this.getTransactionLog = this.getTransactionLog.bind(this);
    this.getTransactionLog = this.getDateAndTime.bind(this);
  }

  componentDidMount(){
    this.getTransactionLog();
    fetch(`/api/transaction-page.php`, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          transactionInfo: response
        })
      })
      .catch(error => { throw (error) });
  }
  getTransactionLog(){
    fetch(`/api/transaction-page.php`,{
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          transactionInfo: response
        })
      })
      .catch(error => { throw (error) });
  }

  getDateAndTime(timestamp){
    let time = convertUnixMonthDay(timestamp);
    return time;
  }

  render() {
    // { this.state.cellProvider.map((cell, index) => <option key={index} value={cell.cell_provider}>{cell.cell_provider}</option>) }
    console.log("transaction", this.state.transactionInfo);
    let log = this.state.transactionInfo.map((log, index) => {
       return(

        <div key={index} className="row-fluid ">
        <div  value={log.date} className="span2 offset1">{convertUnixMonthDay(parseInt(log.date))}</div>
           <div className="col-md-4 ml-1">{log.type}</div>
           <div className="col-md-4 ml-1">{log.round_id}</div>
           <div className="col-md-4 ml-1">{log.first_name + " " + log.last_name}</div>
           <div className="col-md-4 commentFlow">{log.comment}</div>
        </div>

     ) });
      return (
        <React.Fragment>
          <TopMenuGeneral title="Transaction Log" />
          <div className="span2 offset1 headtable">
            <div className="col-md-4 ml-1 dateRight">Date</div>
            <div className="col-md-4 ml-1 typeRight">type</div>
            <div className="col-md-4 ml-1 busRight">Bus Number</div>
            <div className="col-md-4 ml-1 nameRight">Name</div>
            <div className="col-md-4 ">Comments</div>
          </div>
          <div className="overflow-auto logFlow">
          {log}
          </div>
          <div className="row fill1">
            <div className="col-6">Serch By Name</div>
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
