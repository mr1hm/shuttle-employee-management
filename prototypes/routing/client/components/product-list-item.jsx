import React from 'react';

function ProductListItem(props) {
  const productImage = props.specificProduct.image;
  const productName = props.specificProduct.name;
  const productPrice = '$' + (props.specificProduct.price / 100).toFixed(2);
  const productDescription = props.specificProduct.shortDescription;
  const productId = props.specificProduct.id;

  return (
    <div className="col-xs-6 col-sm-4 border border-dark" >
      <div className="card mb-4 shadow-sm" onClick={() => props.changeView('detail', { id: productId })}>
        <img className="bd-placeholder-img card-img-top" width="100%" height="225" src={productImage}></img>
        <div className="card-body">
          <strong className="card-text">{productName}</strong>
          <div className="card-text text-muted">{productPrice}</div>
          <div className="card-text">{productDescription}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductListItem;
