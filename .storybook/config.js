import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import theme from '../src/theme';
import GlobalStyle from '../src/components/GlobalStyle';
import { Normalize } from 'styled-normalize';

const AppDecorator = storyFn => <ThemeProvider theme={theme}><><Normalize /><GlobalStyle />{storyFn()}</></ThemeProvider>;
addDecorator(AppDecorator);

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
