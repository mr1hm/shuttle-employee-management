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
    this.linksRef = React.createRef();
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
        </div>
        <div ref={this.linksRef} className={`dropdown-options ${visibleClass}`}>
          <div className="close-icon" onClick={this.toggleOpen}>
            <FontAwesomeIcon icon={faTimes}/>
          </div>
          {this.props.children}
        </div>
        <div className={`shadow ${visibleClass}`}></div>
      </>
    );

    // return (
    //   <div className = "text-dark dropdown p-0 m-0" onClick={this.toggleOpen}>
    //     <button className = "btn btn-light" type="button" id="dropdownMenuButton" data-toggle = "dropdown" aria-haspopup = "true">
    //       <FontAwesomeIcon icon = {this.state.open ? faTimes : faBars}/>
    //     </button>
    //     <div className = {`dropdown-menu dropdown-menu-right ${this.state.open ? 'show' : ''}`} aria-labelledby = "dropdownMenuButton">
    //       {this.props.children}
    //     </div>
    //   </div>
    // );
  }
}

export default HamburgerMenu;
