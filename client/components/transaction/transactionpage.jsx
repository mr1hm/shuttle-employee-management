import React from 'react';
import './tranaction.css';
import TopMenuGeneral from '../topmenu/topmenu-general';
import { convertUnixMonthDay } from '../../lib/time-functions';

class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: [],
      editButton: false,
      transactionInfo: [],
      userId: null,
      cellProvider: [],
      selected: {
        id: null,
        type: null,
        page: 0
      }
    };
    this.getAllUserNames = this.getAllUserNames.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.handlePageSwitch = this.handlePageSwitch.bind(this);
    this.updateSearchByField = this.updateSearchByField.bind(this);
  }

  componentDidMount() {
    this.getAllUserNames();
    this.handlePageSwitch();
  }

  getDataForCurrentRequest(requestData) {
    if (requestData.type != this.state.selected.type) {
      requestData.page = 0;
    }
    if (requestData.type === 'ALL') {
      requestData.type = null;
    }
    if (requestData.id === '-1') {
      requestData.id = null;
    }
    let requestURL = '/api/transaction-get.php?';
    for (let key in requestData) {
      if (requestData[key] !== null && requestData[key] !== -1) {
        requestURL += `${key}=${requestData[key]}&`;
      }
    }
    fetch(requestURL, {
      method: 'GET'
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          transactionInfo: response
        });
      })
      .catch(error => { throw (error); });
  }

  updateSearchByField(event) {
    let seleted = this.state.selected;
    if (event != undefined) {
      let targetElement = event.target;
      let fieldName = targetElement.getAttribute('name');
      let fieldValue = targetElement.value;
      const newObj = { ...this.state.selected };
      newObj[fieldName] = fieldValue;
      this.setState({
        selected: newObj
      });
      this.getDataForCurrentRequest(newObj);

    } else{
      this.getDataForCurrentRequest(seleted);
    }
  }

  getAllUserNames() {
    fetch(`/api/transaction-get-name.php`, {
      method: 'GET'
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          userName: response
        });
      })
      .catch(error => { throw (error); });
  }

  handlePageSwitch() {
    let currentPage = this.state.transactionInfo.currentPage;
    fetch(`/api/transaction-get.php?page=${currentPage}`, {
      method: 'GET'
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        this.setState({
          transactionInfo: response
        });
      })
      .then(this.updateSearchByField)
      .catch(error => { throw (error); });

  }

  handlePaginationClick(event) {
    let pageNum = parseInt(event.target.textContent) - 1;
    let page = { ...this.state.transactionInfo };
    page.currentPage = pageNum;
    let newSelected = { ...this.state.selected };
    newSelected.page = pageNum;
    this.setState({
      transactionInfo: page,
      selected: newSelected
    });
    setTimeout(() => {
      this.updateSearchByField();
    }, 200);
  }

  render() {
    let log = null;
    let pagination = this.state.transactionInfo.totalPages;
    if (this.state.transactionInfo.data === undefined) {
      log = this.state.transactionInfo.map((log, index) => {
        return (
          <div key={index} className="row-fluid ">
            <div value={log.date} className="span2 offset1">{convertUnixMonthDay(parseInt(log.date))}</div>
            <div className="col-md-4 ml-1">{log.type}</div>
            <div className="col-md-4 ml-1">{log.round_id}</div>
            <div className="col-md-4 ml-1">{log.first_name + ' ' + log.last_name}</div>
            <div className="col-md-4 commentFlow">{log.comment}</div>
          </div>
        );
      });
    }

    if (this.state.transactionInfo.data != undefined) {
      log = this.state.transactionInfo.data.map((log, index) => {
        return (
          <div key={index} className="row-fluid ">
            <div value={log.date} className="span2 offset1">{convertUnixMonthDay(parseInt(log.date))}</div>
            <div className="col-md-4 ml-1">{log.type}</div>
            <div className="col-md-4 ml-1">{log.round_id}</div>
            <div className="col-md-4 ml-1">{log.first_name + ' ' + log.last_name}</div>
            <div className="col-md-4 commentFlow">{log.comment}</div>
          </div>

        );
      });
    }

    if (pagination) {
      const count = pagination;
      pagination = [];
      for (let pageIndex = 0; pageIndex < count; pageIndex++) {
        pagination.push(<li name="page" key={pageIndex} className="page-item"><a onClick={event => this.handlePaginationClick(event)} key={pageIndex} value={pageIndex} className="page-link" href="#">{pageIndex + 1}</a></li>);

      }
    } else{
      pagination = <li className="page-item"><a onClick={this.handlePaginationClick} className="page-link" href="#">1</a></li>;
    }

    return (
      <React.Fragment>
        <TopMenuGeneral userId={this.props.userId} title="Transaction Log" />
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
          <select name='id' onChange={() => this.updateSearchByField(event)} className="col-6 mb-2 editInput" type="text" >
            <option key={-1} value={-1}>ALL USERS</option>
            {this.state.userName.map((data, index) => <option key={index} value={data.id}>{data.first_name + ' ' + data.last_name}</option>)}
          </select>
        </div>
        <div className="row fill2">
          <div className="col-6">Search By Type</div>
          <select name='type' onChange={() => this.updateSearchByField(event)} className="col-6 mb-2 editInput" type="text" >
            <option value="ALL">ALL</option>
            <option value="post">POST</option>
            <option value="trade">TRADE</option>
            <option value="cancel">CANCEL</option>
          </select>
        </div>
        <nav aria-label="...">
          <ul className="pagination ml-5 mt-2">
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
