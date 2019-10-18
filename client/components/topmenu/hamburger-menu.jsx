import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

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
          <FontAwesomeIcon icon = {this.state.open ? faTimes : faBars}/>
        </button>
        <div className = {`dropdown-menu dropdown-menu-right ${this.state.open ? 'show' : ''}`} aria-labelledby = "dropdownMenuButton">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default HamburgerMenu;
