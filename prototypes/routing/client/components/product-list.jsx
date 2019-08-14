import React from 'react';
import ProductListItem from './product-list-item';

function ProductList(props) {
  var productElements = props.arrayOfProducts.map(product => {
    return <ProductListItem key={product.id} specificProduct={product} changeView={props.changeView}/>;
  });
  return (
    <div className="container">
      <div className="row">{productElements}</div>
    </div>
  );
}

export default ProductList;
