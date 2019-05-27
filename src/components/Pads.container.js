import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { connect } from 'react-redux';
import { calcStartOffset, calcDuration } from '../lib/conversion';
import { generateChromaticMap } from '../lib/pitch';
import Pads from './Pads';
// prettier-ignore
const keyMapSeq = {
  'shift+1': 0 , 'shift+2': 1 , 'shift+3': 2 , 'shift+4': 3,
  'shift+q': 4 , 'shift+w': 5 , 'shift+e': 6 , 'shift+r': 7,
  'shift+a': 8 , 'shift+s': 9 , 'shift+d': 10, 'shift+f': 11,
  'shift+z': 12, 'shift+x': 13, 'shift+c': 14, 'shift+v': 15,
};
// prettier-ignore
const keyMap = {
  '1': 0 , '2': 1 , '3': 2 , '4': 3,
  'q': 4 , 'w': 5 , 'e': 6 , 'r': 7,
  'a': 8 , 's': 9 , 'd': 10, 'f': 11,
  'z': 12, 'x': 13, 'c': 14, 'v': 15,
};

const PadsContainer = ({
  activePattern,
  activeSampleId,
  activeStep,
  chaining,
  copiedPatterns,
  copyingPattern,
  dispatch,
  mode,
  onLiveRecord,
  patternChain,
  patternChainPending,
  patterns,
  recordingPrf,
  samples,
}) => {
  function perform(padId) {
    const { sample, start, duration, pitch } = samples.find(
      sound => sound.id === activeSampleId,
    );
    const chromaticMap = generateChromaticMap(pitch);
    const playbackRate = chromaticMap[padId];
    sample.playbackRate = playbackRate;
    sample.start(
      undefined,
      calcStartOffset(start, sample.buffer.length),
      calcDuration(16 - duration),
    );
    dispatch({
      type: 'playback-rate',
      lastPlayedPlaybackRate: playbackRate,
    });
    if (recordingPrf) {
      onLiveRecord();
    }
  }
  function sequence(padId) {
    dispatch({ type: 'toggle-step', padId });
  }
  function pattern(padId) {
    if (copyingPattern) {
      return dispatch({ type: 'copy-pattern-to', padId });
    }
    return dispatch({ type: 'pattern-select', padId });
  }
  const modeFuncMap = {
    prf: perform,
    seq: sequence,
    pat: pattern,
  };
  function press(padId) {
    modeFuncMap[mode](padId);
  }
  const modeFuncMapKeys = {
    prf: perform,
    seq: perform,
    pat: pattern,
  };
  function keyPress(padId) {
    modeFuncMapKeys[mode](padId);
  }

  function litPads() {
    if (mode === 'seq' || mode === 'prf') {
      return patterns[activePattern]
        .map((step, n) => {
          return step.some(sample => sample.id === activeSampleId)
            ? n
            : undefined;
        })
        .filter(value => value !== undefined);
    }
    if (mode === 'pat') {
      if (copyingPattern) {
        return [activePattern, ...copiedPatterns];
      }
      if (chaining) {
        return patternChainPending;
      }
      return patternChain;
    }
    return [];
  }

  function litIndicators() {
    if (mode === 'pat') {
      // Displays lit indicators that contain any active steps
      return patterns
        .map((pattern, patternIndex) => {
          return pattern.reduce((acc, step) => {
            return acc + step.length;
          }, 0) > 0
            ? patternIndex
            : undefined;
        })
        .filter(active => active !== undefined);
    }
    return [activeStep];
  }

  function flashingIndicators() {
    if (mode === 'pat' && copyingPattern) {
      return [activePattern];
    }
    return [];
  }

  return (
    <>
      <KeyboardEventHandler
        handleKeys={Object.keys(keyMap)}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          keyPress(keyMap[key]);
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
        flashingIndicators={flashingIndicators()}
        onPadPress={press}
      />
    </>
  );
};

export default connect(
  ({
    activePattern,
    activeSampleId,
    activeStep,
    chaining,
    copiedPatterns,
    copyingPattern,
    dispatch,
    mode,
    patternChain,
    patternChainPending,
    patterns,
    recordingPrf,
    samples,
  }) => ({
    activePattern,
    activeSampleId,
    activeStep,
    chaining,
    copiedPatterns,
    copyingPattern,
    dispatch,
    mode,
    patternChain,
    patternChainPending,
    patterns,
    recordingPrf,
    samples,
  }),
)(PadsContainer);
