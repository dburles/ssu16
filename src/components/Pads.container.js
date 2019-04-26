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
const keyMapSeq = {
  'shift+1': 0 , 'shift+2': 1 , 'shift+3': 2 , 'shift+4': 3,
  'shift+q': 4 , 'shift+w': 5 , 'shift+e': 6 , 'shift+r': 7,
  'shift+a': 8 , 'shift+s': 9 , 'shift+d': 10, 'shift+f': 11,
  'shift+z': 12, 'shift+x': 13, 'shift+c': 14, 'shift+v': 15,
};
// prettier-ignore
const keyMapPrf = {
  '1': 0 , '2': 1 , '3': 2 , '4': 3,
  'q': 4 , 'w': 5 , 'e': 6 , 'r': 7,
  'a': 8 , 's': 9 , 'd': 10, 'f': 11,
  'z': 12, 'x': 13, 'c': 14, 'v': 15,
};

const PadsContainer = ({ state, dispatch, activeStep, onLiveRecord }) => {
  function perform(padId) {
    const { sample, start } = state.samples.find(
      sound => sound.id === state.activeSampleId,
    );
    sample.playbackRate = chromaticMap[padId];
    sample.start(undefined, start / 1000);
    dispatch({
      type: 'playback-rate',
      lastPlayedPlaybackRate: chromaticMap[padId],
    });
    if (state.recordingPrf) {
      onLiveRecord();
    }
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
    if (state.mode === 'seq' || state.mode === 'prf') {
      return state.patterns[state.activePattern]
        .map((step, n) => {
          return step.some(sample => sample.id === state.activeSampleId)
            ? n
            : undefined;
        })
        .filter(value => value !== undefined);
    }
    if (state.mode === 'pat') {
      return state.patternChain;
    }

    return [];
  }

  function litIndicators() {
    // TODO
    // if (state.mode === 'pat') {
    //   const lit = [];
    //   state.patterns.forEach((step, n) => {
    //     // console.log(step[n], n);
    //     if (step[n].length > 0) {
    //       lit.push(n);
    //     }
    //   });
    //   return lit;
    // }
    return [activeStep];
  }

  return (
    <>
      <KeyboardEventHandler
        handleKeys={Object.keys(keyMapPrf)}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          perform(keyMapPrf[key]);
        }}
      />
      <KeyboardEventHandler
        handleKeys={Object.keys(keyMapSeq)}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          sequence(keyMapSeq[key]);
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
