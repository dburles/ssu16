import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Pads from './Pads';

// prettier-ignore
const chromaticMap = [
  1.259921, 1.334839, 1.414213, 1.498307,
  1       , 1.059463, 1.122462, 1.189207,
  0.587401, 0.681792, 0.781797, 0.887748,
  0.259921, 0.334839, 0.414213, 0.498307
];
// prettier-ignore
const keyMap = {
  'shift+1': 0 , 'shift+2': 1 , 'shift+3': 2 , 'shift+4': 3,
  'shift+q': 4 , 'shift+w': 5 , 'shift+e': 6 , 'shift+r': 7,
  'shift+a': 8 , 'shift+s': 9 , 'shift+d': 10, 'shift+f': 11,
  'shift+z': 12, 'shift+x': 13, 'shift+c': 14, 'shift+v': 15,
};

const PadsContainer = ({ state, dispatch }) => {
  function perform(padId) {
    const { sample } = state.samples[state.activeSampleId];
    sample.playbackRate = chromaticMap[padId];
    sample.start();
    dispatch({
      type: 'playback-rate',
      lastPlayedPlaybackRate: chromaticMap[padId],
    });
  }
  function sequence(padId) {
    dispatch({ type: 'toggle-step', padId });
  }
  function pattern(padId) {
    dispatch({ type: 'pattern-select', padId });
  }
  const modeFuncMap = {
    prf: perform,
    seq: sequence,
    pat: pattern,
  };
  function press(padId) {
    modeFuncMap[state.mode](padId);
  }

  function litPads() {
    if (state.mode === 'seq') {
      return state.steps
        .map((step, n) => {
          return step[state.activePattern].some(
            sample => sample.id === state.activeSampleId,
          )
            ? n
            : undefined;
        })
        .filter(value => value !== undefined);
    }
    if (state.mode === 'pat') {
      return state.patterns;
    }

    return [];
  }

  function litIndicators() {
    if (state.mode === 'pat') {
      debugger;
      const lit = [];
      return state.steps.forEach((step, n) => {
        if (step[n] !== undefined) {
          lit.push(n);
        }
      });
      return lit;
    }
    return [state.activeStep];
  }

  return (
    <>
      <KeyboardEventHandler
        handleKeys={Object.keys(keyMap)}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          press(keyMap[key]);
        }}
      />
      <Pads
        litPads={litPads()}
        litIndicators={litIndicators()}
        onPadPress={press}
      />
    </>
  );
};

export default PadsContainer;
