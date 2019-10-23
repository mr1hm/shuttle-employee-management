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
    return (
          <>
            <div className="dropdown-icon" onClick={this.toggleOpen}>
              <FontAwesomeIcon icon={faBars} />
              <div className="notification-badge">
                {this.props.count}
              </div>
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
