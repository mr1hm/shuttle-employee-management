import React from 'react';
import CartSummaryItem from './cart-summary-item';

function CartSummary(props) {

  var array = props.arrayOfCartItems;
  var cartElements = props.arrayOfCartItems.map(item => {
    return <CartSummaryItem key={item.id} cartItem={item} />;
  });

  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i].price;
  }

  var sumDollars = (sum / 100).toFixed(2);

  var itemTotal = `Item Total: $${sumDollars}`;

  if (!array.length) {
    return (
      <div>There are no items in the cart.</div>
    );
  }
  return (
    <div className="container">
      <div>
        <form action="./product-list" >
          <input type="submit" value="< back to catalog" className="border-0" onClick={() => props.changeView('catalog', {})}/>
        </form>
      </div>
      <h4>My Cart</h4>
      <div className="container">
        <div className="row">{cartElements}</div>
      </div>
      <div className="container">
        <h5 className="mt-2">{itemTotal}</h5>
        <button onClick={() => props.changeView('checkout', {})}>Checkout</button>
      </div>

    </div>
  );
}

export default CartSummary;
