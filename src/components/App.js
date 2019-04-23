import React, { useReducer, useEffect } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Flex, Box } from 'rebass';
import styled from 'styled-components'
import Tone from 'tone';
import BassDrum1 from '../samples/Roland_TR-707/BassDrum1.wav';
import BassDrum2 from '../samples/Roland_TR-707/BassDrum2.wav';
import CowBell from '../samples/Roland_TR-707/CowBell.wav';
import Crash from '../samples/Roland_TR-707/Crash.wav';
import HandClap from '../samples/Roland_TR-707/HandClap.wav';
import HhC from '../samples/Roland_TR-707/HhC.wav';
import HhO from '../samples/Roland_TR-707/HhO.wav';
import HiTom from '../samples/Roland_TR-707/HiTom.wav';
import LowTom from '../samples/Roland_TR-707/LowTom.wav';
import MedTom from '../samples/Roland_TR-707/MedTom.wav';
import Ride from '../samples/Roland_TR-707/Ride.wav';
import RimShot from '../samples/Roland_TR-707/RimShot.wav';
import Snare1 from '../samples/Roland_TR-707/Snare1.wav';
import Snare2 from '../samples/Roland_TR-707/Snare2.wav';
import Tamb from '../samples/Roland_TR-707/Tamb.wav';
import ContextParameters from './ContextParameters.container';
import Pads from './Pads.container';
import SampleParameters from './SampleParameters.container';
import SoundPool from './SoundPool.container';
import Transport from './Transport.container';

function createSample(buffer, name, id) {
  return {
    id,
    sample: new Tone.Player(buffer).toMaster(),
    buffer,
    name,
    volume: 100,
  };
}

const initialState = {
  samples: [
    { sample: BassDrum1, name: 'BassDrum1.wav' },
    { sample: CowBell, name: 'CowBell.wav' },
    { sample: HandClap, name: 'HandClap.wav' },
    { sample: HhO, name: 'HhO.wav' },
    { sample: LowTom, name: 'LowTom.wav' },
    { sample: Ride, name: 'Ride.wav' },
    { sample: Snare1, name: 'Snare1.wav' },
    { sample: Tamb, name: 'Tamb.wav' },
    { sample: BassDrum2, name: 'BassDrum2.wav' },
    { sample: Crash, name: 'Crash.wav' },
    { sample: HhC, name: 'HhC.wav' },
    { sample: HiTom, name: 'HiTom.wav' },
    { sample: MedTom, name: 'MedTom.wav' },
    { sample: RimShot, name: 'RimShot.wav' },
    { sample: Snare2, name: 'Snare2.wav' },
  ].map(({ sample, name }, id) => createSample(sample, name, id)),
  playing: false,
  activePattern: 0,
  activeSampleId: 0,
  lastPlayedPlaybackRate: 1,
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
  // a chain of patterns
  patterns: [0],
  chaining: false,
};

function volumeToDb(volume) {
  return Tone.gainToDb(Number(volume) / 100);
}

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
      return { ...state, mode: action.mode, chaining: false };
    case 'active-sample':
      return {
        ...state,
        activeSampleId: action.sampleId,
        lastPlayedPlaybackRate: 1,
      };
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
        const { buffer, volume } = state.samples[state.activeSampleId];
        const sample = new Tone.Player(buffer).toMaster();
        sample.volume.value = volumeToDb(volume);
        sample.playbackRate = state.lastPlayedPlaybackRate;
        state.steps[action.padId][state.activePattern].push({
          id: state.activeSampleId,
          sample,
        });
      }

      // console.log(state.steps);

      return { ...state };
    case 'swing':
      return { ...state, swing: Number(action.swing) };
    case 'sample-volume':
      state.samples[state.activeSampleId].volume = action.volume;
      state.samples[state.activeSampleId].sample.volume.value = volumeToDb(
        action.volume,
      );
      return { ...state };
    case 'playback-rate':
      return {
        ...state,
        lastPlayedPlaybackRate: action.lastPlayedPlaybackRate,
      };
    case 'pattern-select':
      return {
        ...state,
        activePattern: action.padId,
        chaining: true,
        patterns: state.chaining
          ? [...state.patterns, action.padId]
          : [action.padId],
      };
    case 'add-sample':
      return {
        ...state,
        samples: [
          ...state.samples,
          createSample(action.buffer, action.name, state.samples.length),
        ],
      };
    default:
      throw new Error('Unknown dispatch action');
  }
}

const SoundPoolWrapper = styled(Box)`
  height: 100vh;
  overflow: auto;
`;

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  function togglePlay() {
    if (state.playing) {
      dispatch({ type: 'play-stop' });
      Tone.Transport.stop();
    } else {
      dispatch({ type: 'play-start' });
      Tone.Transport.start();
    }
  }

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = state.playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = 'fastest';
  }, []);

  useEffect(() => {
    Tone.Transport.swingSubdivision = '16n';
    Tone.Transport.swing = state.swing / 100;
    Tone.Transport.bpm.value = state.bpm;
  }, [state.bpm, state.swing]);

  useEffect(() => {
    // Tone.Transport.loop = true;
    // Tone.Transport.loopEnd = '4m';

    const loop = new Tone.Sequence(
      (time, step) => {
        // sample.start(time);

        state.steps[step].forEach(pattern => {
          pattern.forEach(({ sample }) => {
            sample.start(time);
          });
        });

        Tone.Draw.schedule(() => {
          dispatch({ type: 'active-step', step });
        });
        // console.log(time, step);
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n',
    );

    loop.start();
  }, [state.steps]);

  return (
    <>
      <Flex>
        <SoundPoolWrapper>
          <SoundPool state={state} dispatch={dispatch} />
        </SoundPoolWrapper>

        <Flex flexDirection="column">
          <Box>
            <Transport
              state={state}
              dispatch={dispatch}
              togglePlay={togglePlay}
            />
          </Box>
          <Flex>
            <SampleParameters state={state} dispatch={dispatch} />
            <Pads state={state} dispatch={dispatch} />
            <ContextParameters mode={state.mode} />
          </Flex>
        </Flex>
      </Flex>

      <KeyboardEventHandler
        handleKeys={['space']}
        onKeyEvent={(key, event) => {
          event.preventDefault();
          togglePlay();
        }}
      />
    </>
  );
};

export default App;
