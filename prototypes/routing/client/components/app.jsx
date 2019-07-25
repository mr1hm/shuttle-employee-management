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

  loginView() {
    return <h2>Login</h2>;
  }

  welcomeView() {
    return <h2>Welcome</h2>;
  }

  dailyView() {
    return <h2>My Shifts - Day</h2>;
  }

  monthlyView() {
    return <h2>My Shifts- Month</h2>;
  }

  weeklyView() {
    return <h2>My Shifts - Week </h2>;
  }

  availableShifts() {
    return <h2>Available Shifts</h2>;
  }

  // link from hamburger menu
  myInfo() {
    return <h2>My Info</h2>;
  }

  // link from hamburger menu
  adminSummaryPage() {
    return <h2>Admin</h2>;
  }

  // link from hamburger menu
  campusResources() {
    return <h2>Resources</h2>;
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
                <Link to="/">Login</Link>
              </li>
              <li>
                <Link to="/welcome/">Welcome</Link>
              </li>
              <li>
                <Link to="/weekly/">View Week</Link>
              </li>
              <li>
                <Link to="/daily/">View Day</Link>
              </li>
              <li>
                <Link to="/monthly/">View Month</Link>
              </li>
              <li>
                <Link to="/available/">Add Shift</Link>
              </li>
              <li>
                <Link to="/myinfo/">My Info</Link>
              </li>
              <li>
                <Link to="/admin/">Admin</Link>
              </li>
              <li>
                <Link to="/resources/">Resources</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={this.loginView} />
          <Route path="/welcome/" component={this.welcomeView} />
          <Route path="/weekly/" component={this.weeklyView} />
          <Route path="/monthly/" component={this.monthlyView} />
          <Route path="/daily/" component={this.dailyView} />
          <Route path="/available/" component={this.availableShifts} />

          <Route path="/myinfo/" component={this.myInfo} />
          <Route path="/admin/" component={this.adminSummaryPage} />
          <Route path="/resources/" component={this.campusResources} />
        </div>
      </Router>
    );
  }
}
