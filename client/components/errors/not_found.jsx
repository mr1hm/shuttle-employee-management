import React from 'react';
import { Link } from 'react-router-dom';
import './not_found.scss';

const NotFound = props => (
  <div className="not-found">
    <div className="not-found-content">
      <h1>404 Page Not Found</h1>
      <div><Link to="/welcome">Return to Home</Link></div>
    </div>
  </div>
);

export default NotFound;
