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
      onChangeSwing={event => {
        dispatch({ type: 'swing', swing: event.target.value });
      }}
      onChangeBpm={event => {
        dispatch({ type: 'bpm', bpm: event.target.value });
      }}
      swing={state.swing}
    />
  );
};

export default TransportContainer;
