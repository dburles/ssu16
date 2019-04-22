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
  .587401 , .681792 , .781797 , .887748 ,
  .259921 , .334839 , .414213 , .498307
];

const PadsContainer = ({ state }) => {
  return (
    <Pads
      litIndicators={[state.activeStep]}
      onPadPress={padId => {
        if (state.mode === 'prf') {
          const { sample } = state.samples.find(
            sample => sample.id === state.activeSampleId,
          );
          sample.playbackRate = chromaticMap[padId];
          sample.start();
        }
      }}
    />
  );
};

export default PadsContainer;
