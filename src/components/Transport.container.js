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
        onKeyEvent={key => {
          dispatch({ type: 'mode', mode: modeKeyMap[key] });
        }}
      />
      <KeyboardEventHandler
        handleKeys={['space']}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          togglePlay();
        }}
      />
      <KeyboardEventHandler
        handleKeys={['r']}
        onKeyEvent={() => {
          dispatch({ type: 'record-perf-toggle' });
        }}
      />
      <Transport
        pattern={state.activePattern}
        onChangeMode={mode => {
          dispatch({ type: 'mode', mode });
        }}
        mode={state.mode}
        bpm={state.bpm}
        playing={state.playing}
        recordingPerf={state.recordingPerf}
        onTogglePlay={() => {
          togglePlay();
        }}
        onToggleRecord={() => {
          dispatch({ type: 'record-perf-toggle' });
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
