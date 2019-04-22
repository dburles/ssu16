import React from 'react';
import Pads from './Pads';

const pads = [
  // step 0
  [
    {
      id: '...', // sample id
      pattern: 0, // the pattern that this sample belongs to
      // inherit from values defined for sound
      // then adjusted via step context
      // volume
      // start
      // end
      // filter: {
      //   cut
      //   res
      // }
    },
    {
      pattern: 2,
    },
  ],
  // step 1
  [],
];

// const chromaticMap = [5, 4, 3, 2, 1, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11];
// const chromaticMap = [
//   5,
//   4,
//   3,
//   2,
//   1,
//   -1,
//   -2,
//   0.9,
//   0.8,
//   0.7,
//   0.6,
//   0.5,
//   0.4,
//   0.3,
//   0.2,
//   0.1,
// ];

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
      litPads={state.steps
        .map((step, n) => {
          return step[state.activePattern].some(
            sample => sample.id === state.activeSampleId,
          )
            ? n
            : undefined;
        })
        .filter(value => value !== undefined)}
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
