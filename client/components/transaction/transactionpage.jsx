import React from 'react';
import './tranaction.css';
import TopMenuGeneral from '../topmenu/topmenu-general';
import { convertUnixMonthDay } from '../../lib/time-functions';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName:[],
      editButton: false,
      transactionInfo: [],
      userId: null,
      cellProvider: []
    }
    this.getTransactionLog = this.getTransactionLog.bind(this);
    this.getAllUserNames = this.getAllUserNames.bind(this);
    this.searchByName = this.searchByName.bind(this);
    this.searchByType = this.searchByType.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }

  componentDidMount(){
    this.getAllUserNames();
    if(this.state.userName.length === 0){
      this.getTransactionLog();
    }
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
      });

  }
  searchByName(event) {
    let nameIndex = event.target.selectedIndex;
    let userId = event.target[nameIndex].value;
    fetch(`/api/transaction-get.php/?id=${userId}`, {
      method: 'GET',
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
  searchByType(event) {
    let typeIndex = event.target.selectedIndex;
    let userType = event.target[typeIndex].value;
    console.log("event0", event.target[typeIndex].value);
    console.log("event1", event.target.selectedIndex);
    fetch(`/api/transaction-get.php?type=${userType}`, {
      method: 'GET',
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
  getAllUserNames() {
    fetch(`/api/transaction-get-name.php`, {
      method: 'GET'
    })
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          userName: response
        })
      })
      .catch(error => { throw (error) });
  }
  handlePaginationClick(event) {
    let pageNum = parseInt(event.target.textContent) -1;
    console.log("pageinationclick", pageNum);
    console.log("currentpagevalue", this.state.transactionInfo.currentPage);
    const currentPage = this.state.transactionInfo.currentPage;
    this.setState({
      currentPage: currentPage + pageNum
    })
    console.log("aftercurrentpagevalue", this.state.transactionInfo.currentPage);
  }

  render() {
    console.log("transaction",this.state.transactionInfo);
    var log = null;
    var pagination = this.state.transactionInfo.totalPages;
    console.log("page", pagination);
    if (this.state.transactionInfo.data === undefined) {
    log = this.state.transactionInfo.map((log, index) => {
       return(
        <div key={index} className="row-fluid ">
        <div  value={log.date} className="span2 offset1">{convertUnixMonthDay(parseInt(log.date))}</div>
           <div className="col-md-4 ml-1">{log.type}</div>
           <div className="col-md-4 ml-1">{log.round_id}</div>
           <div className="col-md-4 ml-1">{log.first_name + " " + log.last_name}</div>
           <div className="col-md-4 commentFlow">{log.comment}</div>
        </div>
        )
      });
    }

    if (this.state.transactionInfo.data != undefined) {
       log = this.state.transactionInfo.data.map((log, index) => {
        return (
          <div key={index} className="row-fluid ">
            <div value={log.date} className="span2 offset1">{convertUnixMonthDay(parseInt(log.date))}</div>
            <div className="col-md-4 ml-1">{log.type}</div>
            <div className="col-md-4 ml-1">{log.round_id}</div>
            <div className="col-md-4 ml-1">{log.first_name + " " + log.last_name}</div>
            <div className="col-md-4 commentFlow">{log.comment}</div>
          </div>

        )
      });
    }

    if(pagination){
      const count = pagination;
      pagination = [];
     for(let pageIndex=0;pageIndex<count;pageIndex++){
       pagination.push(<li key={pageIndex} className="page-item"><a onClick={this.handlePaginationClick} key={pageIndex} value={pageIndex} className="page-link" href="#">{pageIndex+1}</a></li>)

     }
    }else{
      pagination = <li className="page-item"><a onClick={this.handlePaginationClick} className="page-link" href="#">1</a></li>;
    }



       console.log("log",log);
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
            <div className="col-6">Search By Name</div>
            <select onChange={() => this.searchByName(event)} className="col-6 mb-2 editInput" type="text" >
              {this.state.userName.map((data, index) => <option  key={index} value={data.id}>{data.first_name + " " + data.last_name}</option>)}
            </select>
          </div>
          <div className="row fill2">
            <div className="col-6">Search By Type</div>
            <select onChange={() => this.searchByType(event)} className="col-6 mb-2 editInput" type="text" >
              <option value="post">POST</option>
              <option value="trade">TRADE</option>
              <option value="cancel">CANCEL</option>
            </select>
          </div>
          <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              {pagination}
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </React.Fragment>
      );
    }
}

export default Transaction;
