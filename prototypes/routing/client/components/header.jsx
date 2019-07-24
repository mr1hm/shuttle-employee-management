import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

function Header(props) {
  var cartItems = props.cartItemCount + ' items';
  return (
    <div className="container pl-0">
      <div className="row flex-nowrap justify-content-between align-items-center mt-2 mb-2">
        <h3 className="col-6 pt-1">Bonanza Bling</h3>
        <div className="col-6 d-flex justify-content-end align-items-center">
          <div className="p-2" >{cartItems}</div>
          <div onClick={() => props.alterView('cart', {})}>
            <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
