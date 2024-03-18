import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './containers/app-container';
import Register from './components/click-game/register';
import ClickDashboard from './components/click-game/click-dashboard/container';
import ClickView from './components/click-game/click-view';
import Waiting from './containers/click-game-waiting';
import Rank from './components/click-game/rank';

import { store } from './configure-store';
import { init } from './socket';

// const store = configure();
init(store);

const theme = createTheme({
  typography: {
    fontFamily: 'TaipeiSansTC',
    h4: {
      lineHeight: '40px',
    }
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


const TABLES = new Array(20).fill(0).map((_, i) => ({ id: i.toString(), name: `第第第第${i + 1}桌` }));

function randn_bm() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

const root = createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      {/* <App /> */}
      {/* <ClickView onClick={console.log} /> */}
      {/* <Rank tables={TABLES} clickRecords={new Array(3000).fill(0).map((_, i) => ({
        tableId: TABLES[Math.floor(randn_bm() * TABLES.length)].id,
        click: Math.ceil(randn_bm() * 5),
        name: TABLES[Math.floor(randn_bm() * TABLES.length)].name
      }))} /> */}
      <ClickDashboard />
    </Provider>
  </ThemeProvider>,
);
