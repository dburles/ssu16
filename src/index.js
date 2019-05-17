import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import App from './components/App';
import GlobalStyle from './components/GlobalStyle';
import store from './lib/store';
import theme from './theme';
import './load-knobs';

render(
  <ThemeProvider theme={theme}>
    <>
      <Normalize />
      <GlobalStyle />
      <Provider store={store}>
        <App />
      </Provider>
    </>
  </ThemeProvider>,
  document.getElementById('root'),
);
