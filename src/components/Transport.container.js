import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Transport from './Transport';

const modeKeyMap = {
  p: 'prf',
  '[': 'seq',
  ']': 'pat',
};

const TransportContainer = ({ state, dispatch, togglePlay }) => {
  return (
    <>
      <KeyboardEventHandler
        handleKeys={['p', '[', ']']}
        onKeyEvent={(key, event) => {
          dispatch({ type: 'mode', mode: modeKeyMap[key] });
        }}
      />
      <Transport
        pattern={state.activePattern}
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
    </>
  );
};

export default TransportContainer;
