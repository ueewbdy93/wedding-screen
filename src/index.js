import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import theme from './assets/react-toolbox/theme';
import './assets/react-toolbox/theme.css';

ReactDOM.render(<ThemeProvider theme={theme}><App /></ThemeProvider>, document.getElementById('root'));
registerServiceWorker();
