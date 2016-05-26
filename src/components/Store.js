'use strict';

import React from 'react';
import {Provider} from 'react-redux';

import store from './store';
import actions from './actions';

class StoreComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    store.dispatch(actions.startListeningToUser());
  }

  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default StoreComponent;