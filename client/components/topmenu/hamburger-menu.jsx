import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './hamburger-menu.css';
import { parse } from 'querystring';
import SwapConfirmNotification from '../swap-confirm-notification';
class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      notificationCount: 0
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
  }
  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }
  componentDidMount() {
    this.getNotifications();
  }
  getNotifications() {
    const ID = this.props.userId ? this.props.userId : 17;
    let fetchSwapAndTradeRequest = fetch(`/api/get-notifications.php?id=${ID}`);
    let fetchSwapConfirmations = fetch(`/api/get-final-swap-confirmation.php?id=${ID}`);

    Promise.all([fetchSwapAndTradeRequest, fetchSwapConfirmations])
      .then(data => Promise.all(data.map(response => response.json())))
      .then(allData => {
        let swapAndTradeRequest = allData[0];
        let swapConfirmations = allData[1];
        if (swapConfirmations.length > 0) {
          this.setState({
            notificationCount: parseInt(swapAndTradeRequest.length) + 1
          });
        } else {
          this.setState({
            notificationCount: parseInt(swapAndTradeRequest.length)
          });
        }
      })
      .catch(error => console.error('Fetch failed', error));
  }
      
  render() {
    const visibleClass = this.state.open ? 'visible' : 'hidden';
    const menuNotification = (<div className="notification-badge move-notification">
      <div className="notification-count">{this.state.notificationCount}</div>
    </div>);
    const notification =
      (<div className="notification-badge">
        <div className="notification-count">{this.state.notificationCount}</div>
      </div>);
    return (
      <>
        <div className="dropdown-icon" onClick={this.toggleOpen}>
          <FontAwesomeIcon icon={faBars} />
          {this.state.notificationCount > 0 && notification}
        </div>
        <div className={`dropdown-options ${visibleClass}`}>
          <div className="close-icon" onClick={this.toggleOpen}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          {this.state.notificationCount > 0 && menuNotification}
          {this.props.children}
        </div>
        <div className={`shadow ${visibleClass}`}></div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.user.uciNetId
  };
}

export default connect(mapStateToProps)(HamburgerMenu);
