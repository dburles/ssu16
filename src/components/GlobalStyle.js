import { createGlobalStyle } from 'styled-components';
import { themeGet } from 'styled-system';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${themeGet('colors.darkGray')};
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
  }
`;

export default GlobalStyle;
