import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      cart: [],
      view: {
        name: 'catalog',
        params: {}
      }
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    this.getProducts();
    this.getCartItems();
  }

  getProducts() {
    fetch('/api/products.php')
      .then(response => response.json())
      .then(productsFromServer => {
        this.setState({
          products: productsFromServer
        });
      });
  }

  getCartItems() {
    fetch('/api/cart.php')
      .then(response => response.json())
      .then(cartItemsFromServer => {
        this.setState({
          cart: cartItemsFromServer
        });
      });
  }

  addToCart(product) {
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    };
    fetch('/api/cart.php', request)
      .then(response => response.json())
      .then(newProduct => {
        const allProducts = this.state.cart.concat(newProduct);
        this.setState({
          cart: allProducts
        });
      });
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params: params
      }
    });
  }

  placeOrder(shippingInfo) {
    shippingInfo.cartItems = this.state.cart;
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shippingInfo)
    };
    fetch('/api/orders.php', request)
      .then(response => response.json())
      .then(translatedResponse => {
        this.setState({
          cart: [],
          view: {
            name: 'catalog',
            params: {} }
        });
      });
  }

  pageIndex() {
    return <h2>Home</h2>;
  }

  pageDay() {
    return <h2>Day</h2>;
  }
  
  pageMonth() {
    return <h2>Month</h2>;
  }

  render() {
    var cartArray = this.state.cart;
    var screenView;
    if (this.state.view.name === 'catalog') {
      screenView = <ProductList arrayOfProducts={this.state.products} changeView={this.setView}/>;
    } if (this.state.view.name === 'cart') {
      screenView = <CartSummary arrayOfCartItems={this.state.cart} changeView={this.setView}/>;
    } if (this.state.view.name === 'detail') {
      screenView = <ProductDetails currentView={this.state.view.params} changeView={this.setView} addToCart={this.addToCart}/>;
    } if (this.state.view.name === 'checkout') {
      screenView = <CheckoutForm checkoutView={this.setView} processOrder={this.placeOrder} arrayOfCartItems={this.state.cart} />;
    }
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/day/">Day</Link>
              </li>
              <li>
                <Link to="/month/">Month</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={this.pageIndex} />
          <Route path="/day/" component={this.pageDay} />
          <Route path="/month/" component={this.pageMonth} />
        </div>
      </Router>
    );
  }
}
