import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import NotificationBadge from 'react-notification-badge';
import './nav-styles.css';

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
    return (
      <div className = "text-dark dropdown p-0 m-0" onClick = {this.toggleOpen}>

        <button className = "btn btn-light" type = "button" id = "dropdownMenuButton" data-toggle = "dropdown" aria-haspopup = "true">
          <div className="row justify-content-end mb-2 ml-4">
            <div className="col-1">
              <NotificationBadge count={this.props.numberOfShifts} className="justify-content-end" />
            </div>
          </div>
          <div>
            <div className="col-1">
              <h3>
                <FontAwesomeIcon icon={this.state.open ? faTimes : faBars} />
              </h3>
            </div>
          </div>
        </button>
        <div className = {`dropdown-menu dropdown-menu-right ${this.state.open ? 'show' : ''}`} aria-labelledby = "dropdownMenuButton">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default HamburgerMenu;
