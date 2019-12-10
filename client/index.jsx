import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from './middleware/thunk';
import App from './components/app';
import { onLoadCheckAuth } from './actions';

const store = createStore(rootReducer, applyMiddleware(thunk));

onLoadCheckAuth(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector('#root')
);
