import React from 'react';
import Pads from './Pads';

// prettier-ignore
const chromaticMap = [
  1.259921, 1.334839, 1.414213, 1.498307,
  1       , 1.059463, 1.122462, 1.189207,
  0.587401, 0.681792, 0.781797, 0.887748,
  0.259921, 0.334839, 0.414213, 0.498307
];

const PadsContainer = ({ state, dispatch }) => {
  return (
    <Pads
      litPads={
        state.mode === 'seq'
          ? state.steps
              .map((step, n) => {
                return step[state.activePattern].some(
                  sample => sample.id === state.activeSampleId,
                )
                  ? n
                  : undefined;
              })
              .filter(value => value !== undefined)
          : []
      }
      litIndicators={[state.activeStep]}
      onPadPress={padId => {
        if (state.mode === 'prf') {
          const { sample } = state.samples[state.activeSampleId];
          sample.playbackRate = chromaticMap[padId];
          sample.start();
        }
        if (state.mode === 'seq') {
          dispatch({ type: 'toggle-step', padId });
        }
      }}
    />
  );
};

export default PadsContainer;
