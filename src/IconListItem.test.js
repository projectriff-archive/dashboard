import React from 'react';
import ReactDOM from 'react-dom';
import { InputListItem, OutputListItem } from './IconListItem';

describe('InputListItem', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<InputListItem />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});

describe('OutputListItem', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<OutputListItem />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

});
