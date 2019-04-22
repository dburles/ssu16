import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import Tone from 'tone';
import App from './components/App';
import GlobalStyle from './components/GlobalStyle';
import theme from './theme';

// Tone.Transport.bpm.value = 90;

// const sample = new Tone.Player(kick).toMaster();

// const kicks = [0, 4, 8, 12];

// .sync(); ?

// const loop = new Tone.Sequence(
//   (time, col) => {
//     // sample.start(time);
//     // Tone.Draw.schedule(() => console.log(time, col));
//     console.log(time, col);
//     if (kicks.includes(col)) {
//       sample.start(time);
//     }
//   },
//   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
//   '16n',
// );

// const loop = new Tone.Sequence((time, step) => {
//   sample.start(time);
// });

// loop.start();

// Tone.Transport.scheduleRepeat(time => sample.start(time), '4n', '1m');
{
  /* <button
    onClick={() =>
      Tone.Transport.state === 'started'
        ? Tone.Transport.stop()
        : Tone.Transport.start()
    }
  >
    Start
  </button> */
}
render(
  <ThemeProvider theme={theme}>
    <>
      <Normalize />
      <GlobalStyle />
      <App />
    </>
  </ThemeProvider>,
  document.getElementById('root'),
);
