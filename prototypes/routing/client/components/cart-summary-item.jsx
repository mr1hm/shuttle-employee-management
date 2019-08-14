import React from 'react';

function CartSummaryItem(props) {
  const itemImage = props.cartItem.image;
  const itemName = props.cartItem.name;
  const itemPrice = '$' + (props.cartItem.price / 100).toFixed(2);
  const itemShortDescription = props.cartItem.shortDescription;
  return (
    <div className="container">

      <div className="row">

        <div className="col-sm p-0">
          <img className="bd-placeholder-img card-img-top" width="100%" height="225" src={itemImage}></img>
        </div>

        <div className="col-sm">
          <h4 className="m-2">{itemName}</h4>
          <div className="text-muted" >{itemPrice}</div>
          <div>{itemShortDescription}</div>
        </div>

      </div>

    </div>
  );
}

export default CartSummaryItem;
