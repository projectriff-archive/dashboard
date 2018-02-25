import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Root } from './Root';
import { reducer } from './redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);
