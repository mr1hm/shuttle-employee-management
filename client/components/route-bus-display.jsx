import React from 'react';
import './linesBusesStyle';

function RouteBusDisplay(props) {
  const routeColors = { 'C': '#8f2c9c', 'D': '#a57b51', 'H': '#68ac9e', 'M': '#3a8456', 'N': '#dd7338', 'S': '#7b3913', 'V': '#347cbd', 'W': '#d8442d', 'Hs': '#df6e9d' };
  const routeColorPackage = {
    'backgroundColor': routeColors[props.route] ? routeColors[props.route] : 'gray',
    'color': 'white'
  };
  return (
    <div className="d-flex align-items-center justify-content-center">
      <h3 className="" style={routeColorPackage}>{props.route}</h3>
      <h3 className="" style={{ 'backgroundColor': 'black', 'color': 'white' }}>{props.bus}</h3>
    </div>
  );
}

export default RouteBusDisplay;
