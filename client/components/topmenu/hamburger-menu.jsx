import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './hamburger-menu.css';

class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }
  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const visibleClass = this.state.open ? 'visible' : 'hidden';
    const notification =
    (<div className="notification-badge">
      <div className="notification-count">{this.props.count} </div>
    </div>);
    return (
          <>
            <div className="dropdown-icon" onClick={this.toggleOpen}>
              <FontAwesomeIcon icon={faBars} />
              {this.props.count > 0 && notification}
            </div>
            <div className={`dropdown-options ${visibleClass}`}>
              <div className="close-icon" onClick={this.toggleOpen}>
                <FontAwesomeIcon icon={faTimes} />
              </div>
              {this.props.children}
            </div>
            <div className={`shadow ${visibleClass}`}></div>
          </>
    );
  }
}

export default HamburgerMenu;
