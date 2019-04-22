import React, { useReducer, useEffect } from 'react';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import BassDrum1 from '../samples/Roland_TR-707/BassDrum1.wav';
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
];

const initialState = {
  samples, // remove later
  playing: false,
  activePattern: 0,
  activeSampleId: 0,
  pads: [],
  activeStep: 0,
  bpm: 120,
  mode: 'prf',
};

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
    default:
      throw new Error('Unknown dispatch action');
  }
}

const App = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Tone.Transport.bpm.value = state.bpm;
    // Tone.Transport.loop = true;
    // Tone.Transport.loopEnd = '4m';

    const loop = new Tone.Sequence(
      (time, step) => {
        // sample.start(time);
        Tone.Draw.schedule(() => {
          dispatch({ type: 'active-step', step });
        });
        console.log(time, step);
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n',
    );

    loop.start();
  }, [state.bpm]);

  return (
    <Flex>
      <BorderBox mt={3} color="gray2" borderRight="1px solid">
        <SoundPool state={state} dispatch={dispatch} />
      </BorderBox>
      <Flex ml={3} py={2} px={4} alignItems="center" flexDirection="column">
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
