import React, { useReducer, useEffect } from 'react';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import BassDrum1 from '../samples/Roland_TR-707/BassDrum1.wav';
import HhC from '../samples/Roland_TR-707/HhC.wav';
import Snare1 from '../samples/Roland_TR-707/Snare1.wav';
import BorderBox from './BorderBox';
import Pads from './Pads.container';
import SoundPool from './SoundPool.container';
import Space from './Space';
import Transport from './Transport.container';

const samples = [
  {
    id: 0,
    sample: new Tone.Player(BassDrum1).toMaster(),
    name: 'BassDrum1.wav',
  },
  {
    id: 1,
    sample: new Tone.Player(Snare1).toMaster(),
    name: 'Snare1.wav',
  },
  {
    id: 2,
    sample: new Tone.Player(HhC).toMaster(),
    name: 'HhC.wav',
  },
];

const initialState = {
  samples, // remove later
  playing: false,
  activePattern: 0,
  activeSampleId: 0,
  steps: [
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  ],
  activeStep: 0,
  bpm: 120,
  swing: 0,
  mode: 'prf',
};

// hit step 0

//       [step][pattern] => [{},{}]
// steps[0][0]

function reducer(state, action) {
  switch (action.type) {
    case 'play-start':
      return { ...state, playing: true };
    case 'play-stop':
      return { ...state, playing: false };
    case 'active-step':
      return { ...state, activeStep: action.step };
    case 'bpm':
      return { ...state, bpm: action.bpm };
    case 'mode':
      return { ...state, mode: action.mode };
    case 'active-sample':
      return { ...state, activeSampleId: action.sampleId };
    case 'toggle-step':
      // Already active?
      if (
        state.steps[action.padId][state.activePattern].some(
          sample => sample.id === state.activeSampleId,
        )
      ) {
        state.steps[action.padId][state.activePattern] = state.steps[
          action.padId
        ][state.activePattern].filter(
          sample => sample.id !== state.activeSampleId,
        );
      } else {
        state.steps[action.padId][state.activePattern].push({
          id: state.activeSampleId,
          // ... etc
        });
      }

      // console.log(state.steps);

      return {
        ...state,
        steps: state.steps,
      };
    case 'swing':
      return { ...state, swing: Number(action.swing) };
    default:
      throw new Error('Unknown dispatch action');
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = state.playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = 'fastest';
  }, []);

  useEffect(() => {
    Tone.Transport.swing = state.swing / 100;
  }, [state.swing]);

  useEffect(() => {
    Tone.Transport.bpm.value = state.bpm;

    // Tone.Transport.loop = true;
    // Tone.Transport.loopEnd = '4m';

    const loop = new Tone.Sequence(
      (time, step) => {
        // sample.start(time);

        state.steps[step].forEach(pattern => {
          pattern.forEach(sample => {
            // id: '...', // sample id
            // inherit from values defined for sound
            // then adjusted via step context
            // volume
            // start
            // end
            // filter: {
            //   cut
            //   res
            // }

            samples[sample.id].sample.start(time);
          });
        });

        Tone.Draw.schedule(() => {
          dispatch({ type: 'active-step', step });
        });
        console.log(time, step);
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n',
    );

    loop.start();
  }, [state.bpm, state.steps]);

  return (
    <Flex>
      <BorderBox mt={3} color="gray2" borderRight="1px solid">
        <SoundPool state={state} dispatch={dispatch} />
      </BorderBox>
      <Flex ml={3} py={2} px={4} flexDirection="column">
        <Box>
          <Transport state={state} dispatch={dispatch} />
        </Box>
        <Space my={3} />
        <Box>
          <Pads state={state} dispatch={dispatch} />
        </Box>
      </Flex>
      <Box>Pattern or Step Context</Box>
    </Flex>
  );
};

export default App;
