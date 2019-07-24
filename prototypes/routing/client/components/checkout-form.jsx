import React from 'react';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCardNumber: ''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCreditCardChange = this.handleCreditCardChange.bind(this);
  }

  handleNameChange() {
    const enteredName = event.target.value;
    this.setState({
      name: enteredName
    });
  }

  handleCreditCardChange() {
    const enteredCreditCard = event.target.value;
    this.setState({
      creditCardNumber: enteredCreditCard
    });
  }

  render() {
    var array = this.props.arrayOfCartItems;

    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      sum += array[i].price;
    }

    var sumDollars = (sum / 100).toFixed(2);

    var orderTotal = `Order Total: $${sumDollars}`;

    return (
      <div>

        <div className="container">
          <h3>Checkout</h3>
          <h5>{orderTotal}</h5>
          <div>Name</div>
          <input type="text" value={this.state.name} onChange={this.handleNameChange} ></input>
          <div>Credit Card</div>
          <input type="text" value={this.state.creditCard} onChange={this.handleCreditCardChange} ></input>
          <div>Shipping Address</div>
          <textarea rows="4" cols="50"></textarea>
        </div>

        <div className="container">

          <div className="row">
            <div>
              <form action="./product-list" >
                <input type="submit" value="< Continue Shopping" className="border-0" onClick={() => this.props.checkoutView('catalog', {})}/>
              </form>
            </div>
            <button onClick={() => this.props.processOrder(this.state)}>Place Order</button>
          </div>

        </div>
      </div>
    );
  }
}

export default CheckoutForm;
