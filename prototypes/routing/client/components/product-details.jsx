import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
    this.getProductInfo = this.getProductInfo.bind(this);
  }
  componentDidMount() {
    this.getProductInfo(this.props.currentView.id);
  }

  getProductInfo(id) {

    var searchString = '/api/products.php?id=' + id;
    fetch(searchString)
      .then(response => response.json())
      .then(productFromServer => {
        this.setState({
          product: productFromServer
        });
      });
  }

  render() {
    if (!this.state.product) return <h1>Loading...</h1>;
    const productImage = this.state.product.image;
    const productName = this.state.product.name;
    const productPrice = '$' + (this.state.product.price / 100).toFixed(2);
    const productShortDescription = this.state.product.shortDescription;
    const productLongDescription = this.state.product.longDescription;

    return (
      <div className="container">
        <div>
          <form action="./product-list" >
            <input type="submit" value="< back to catalog" className="border-0" onClick={() => this.props.changeView('catalog', {})}/>
          </form>
        </div>
        <div className="row">
          <div className="col-sm p-0">
            <img className="bd-placeholder-img card-img-top" width="100%" height="225" src={productImage}></img>
          </div>
          <div className="col-sm">
            <h4 >{productName}</h4>
            <div className="text-muted" >{productPrice}</div>
            <div >{productShortDescription}</div>
            <button onClick={() => this.props.addToCart(this.state.product)}>Add to Cart</button>
          </div>
        </div>
        <div className="row">
          <div className="pt-2">{productLongDescription}</div>
        </div>
      </div>
    );
  }
}

export default ProductDetails;
