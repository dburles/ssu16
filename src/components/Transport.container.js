import React from 'react';
import Tone from 'tone';
import Transport from './Transport';

const TransportContainer = ({ state, dispatch }) => {
  return (
    <Transport
      onChangeMode={mode => {
        dispatch({ type: 'mode', mode });
      }}
      mode={state.mode}
      bpm={state.bpm}
      onTogglePlay={() => {
        if (Tone.Transport.state === 'started') {
          dispatch({ type: 'play-stop' });
          Tone.Transport.stop();
        } else {
          dispatch({ type: 'play-start' });
          Tone.Transport.start();
        }
      }}
      onChange={event => {
        const { name, value } = event.target;
        if (name === 'swing') {
          dispatch({ type: 'swing', swing: value });
        }
      }}
      swing={state.swing}
    />
  );
};

export default TransportContainer;
