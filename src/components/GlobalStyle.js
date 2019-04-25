import { createGlobalStyle } from 'styled-components';
import { themeGet } from 'styled-system';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.darkGray')};
    background-image: url('https://source.unsplash.com/random');
    background-size: cover;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
  }
`;

export default GlobalStyle;
