import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './containers/app-container';

import { configure } from './configure-store';
import { init } from './socket';

const store = configure();
init(store);

const theme = createTheme({
  typography: {
    fontFamily: 'TaipeiSansTC'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: TaipeiSansTC;
          src: url(${require('../../public/fonts/TaipeiSansTCBeta-Regular.woff')}) format('woff');
          font-weight: normal;
        }

        @font-face {
          font-family: TaipeiSansTC;
          src: url(${require('../../public/fonts/TaipeiSansTCBeta-Bold.woff')}) format('woff');
          font-weight: bold;
        }
      `,
    }
  }
})

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
);
