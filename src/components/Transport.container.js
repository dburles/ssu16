import React from 'react';
import Tone from 'tone';
import Transport from './Transport';

const TransportContainer = ({ state, dispatch, togglePlay }) => {
  return (
    <Transport
      onChangeMode={mode => {
        dispatch({ type: 'mode', mode });
      }}
      mode={state.mode}
      bpm={state.bpm}
      onTogglePlay={() => {
        togglePlay();
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
