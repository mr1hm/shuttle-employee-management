import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './hamburger-menu.css';
class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      notificationCount: 0
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }
  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }
  componentDidMount() {
    const ID = this.props.userId ? this.props.userId : 17;
    fetch(`/api/get-notifications.php?id=${ID}`)
      .then(response => response.json())
      .then(shiftsArrayOfObjects => {
        this.setState({
          notificationCount: parseInt(shiftsArrayOfObjects.length)
        });
      })
      .catch(error => console.error('Fetch failed', error));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.notificationCount !== this.props.notificationCount) {
      this.setState({ notificationCount: this.props.notificationCount });
    }
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
export default HamburgerMenu;
