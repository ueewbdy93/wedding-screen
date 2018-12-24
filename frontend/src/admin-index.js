import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AdmContainer from './containers/adm-container';

import { configure } from './admin-configure-store';
import { init } from './socket';

const store = configure();
init(store);

ReactDOM.render(
  <Provider store={store}>
    <AdmContainer />
  </Provider>,
  document.getElementById('root'),
);
