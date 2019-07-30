import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (
      <div className = "container d-flex flex-row-reverse">
        <div className = "dropdown p0 m0" onClick = {this.toggleOpen}>
          <button className = "btn btn-primary mt-2" type = "button" id = "dropdownMenuButton" data-toggle = "dropdown" aria-haspopup = "true">
            <FontAwesomeIcon icon = {this.state.open ? faTimes : faBars}/>;
          </button>
          <div className = {`dropdown-menu dropdown-menu-right ${this.state.open ? 'show' : ''}`} aria-labelledby = "dropdownMenuButton">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default HamburgerMenu;
