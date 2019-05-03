import { createGlobalStyle } from 'styled-components';
import { themeGet } from 'styled-system';
import wallpaper from '../wallpapers/glass.jpg';

// background-image: url('https://source.unsplash.com/random');
// background-image: url(${wallpaper});

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.darkGray')};
    background-size: cover;
    background-image: url(${wallpaper});
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
  }
  button {
    outline: none;
  }
`;

export default GlobalStyle;
