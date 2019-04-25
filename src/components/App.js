import produce from 'immer';
import React, { useReducer, useEffect } from 'react';
import { Flex, Box } from 'rebass';
import styled from 'styled-components';
import Tone from 'tone';
import BassDrum1 from '../samples/Roland_TR-707/BassDrum1.wav';
// import BassDrum2 from '../samples/Roland_TR-707/BassDrum2.wav';
// import CowBell from '../samples/Roland_TR-707/CowBell.wav';
// import Crash from '../samples/Roland_TR-707/Crash.wav';
// import HandClap from '../samples/Roland_TR-707/HandClap.wav';
// import HhC from '../samples/Roland_TR-707/HhC.wav';
// import HhO from '../samples/Roland_TR-707/HhO.wav';
// import HiTom from '../samples/Roland_TR-707/HiTom.wav';
// import LowTom from '../samples/Roland_TR-707/LowTom.wav';
// import MedTom from '../samples/Roland_TR-707/MedTom.wav';
// import Ride from '../samples/Roland_TR-707/Ride.wav';
// import RimShot from '../samples/Roland_TR-707/RimShot.wav';
// import Snare1 from '../samples/Roland_TR-707/Snare1.wav';
// import Snare2 from '../samples/Roland_TR-707/Snare2.wav';
// import Tamb from '../samples/Roland_TR-707/Tamb.wav';
import State from '../utils/tinystate';
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
    volume: 80,
    start: 0,
    offset: 0,
    // Patterns the sample paramaters are locked on.
    locked: [],
  };
}

const initialState = {
  samples: [
    { sample: BassDrum1, name: 'BassDrum1.wav' },
    // { sample: CowBell, name: 'CowBell.wav' },
    // { sample: HandClap, name: 'HandClap.wav' },
    // { sample: HhO, name: 'HhO.wav' },
    // { sample: LowTom, name: 'LowTom.wav' },
    // { sample: Ride, name: 'Ride.wav' },
    // { sample: Snare1, name: 'Snare1.wav' },
    // { sample: Tamb, name: 'Tamb.wav' },
    // { sample: BassDrum2, name: 'BassDrum2.wav' },
    // { sample: Crash, name: 'Crash.wav' },
    // { sample: HhC, name: 'HhC.wav' },
    // { sample: HiTom, name: 'HiTom.wav' },
    // { sample: MedTom, name: 'MedTom.wav' },
    // { sample: RimShot, name: 'RimShot.wav' },
    // { sample: Snare2, name: 'Snare2.wav' },
  ].map(({ sample, name }, id) => createSample(sample, name, id)),
  // patterns[pattern][padId][{sample}] => createSample(...)
  // patterns [
  //   pattern [
  //     pad [
  //       sound,
  //       sound,
  //     ],
  //     pad [
  //     ]
  //     pad [
  //       sound
  //     ]
  //   ],
  //   pattern [
  //   ]
  // ]
  patterns: [
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
    [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
  ],
  playing: false,
  activePattern: 0,
  activeSampleId: 0,
  lastPlayedPlaybackRate: 1,
  bpm: 120,
  swing: 0,
  mode: 'seq',
  patternChain: [0],
  chaining: false,
  recordingPrf: false,
  recordingAudio: false,
  // Hold the record button down and release to stop
  // or start/stop.
  recordAudioWhileHeld: true,
};

function volumeToDb(volume) {
  return Tone.gainToDb(Number(volume) / 100);
}

function reducer(state, action) {
  console.log(action);

  function parameterLocked() {
    return state.samples[state.activeSampleId].locked.includes(
      state.activePattern,
    );
  }

  switch (action.type) {
    case 'play-start':
      return { ...state, playing: true };
    case 'play-stop':
      return { ...state, playing: false };
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
      return produce(state, draftState => {
        if (
          // Already active?
          draftState.patterns[state.activePattern][action.padId].some(
            sample => sample.id === state.activeSampleId,
          )
        ) {
          draftState.patterns[state.activePattern][
            action.padId
          ] = state.patterns[state.activePattern][action.padId].filter(
            sample => sample.id !== state.activeSampleId,
          );
        } else {
          const { buffer, volume, start, offset } = state.samples[
            state.activeSampleId
          ];
          const sample = new Tone.Player(buffer).toMaster();
          sample.volume.value = volumeToDb(volume);
          sample.playbackRate = state.lastPlayedPlaybackRate;
          draftState.patterns[state.activePattern][action.padId].push({
            id: state.activeSampleId,
            sample,
            start,
            offset,
          });
        }
      });
    case 'swing':
      return { ...state, swing: Number(action.swing) };
    case 'sample-volume':
      return produce(state, draftState => {
        // Set the volume for the sample.
        draftState.samples[draftState.activeSampleId].volume = action.volume;
        draftState.samples[
          draftState.activeSampleId
        ].sample.volume.value = volumeToDb(action.volume);

        // If we're not parameter locked, adjust volume for all pads.
        if (!parameterLocked()) {
          draftState.patterns[state.activePattern].forEach(pad => {
            pad.forEach(sound => {
              if (sound.id === state.activeSampleId) {
                sound.sample.volume.value = volumeToDb(action.volume);
              }
            });
          });
        }
      });
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
        patternChain: state.chaining
          ? [...state.patternChain, action.padId]
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
    case 'record-perf-toggle':
      return {
        ...state,
        recordingPrf: !state.recordingPrf,
      };
    case 'record-audio-toggle':
      return {
        ...state,
        recordingAudio: !state.recordingAudio,
      };
    case 'sample-start-point':
      return produce(state, draftState => {
        draftState.samples[state.activeSampleId].start = Number(
          action.position,
        );

        // If we're not parameter locked, adjust start point for all pads.
        if (!parameterLocked()) {
          draftState.patterns[state.activePattern].forEach(pad => {
            pad.forEach(sound => {
              if (sound.id === state.activeSampleId) {
                sound.start = action.position;
              }
            });
          });
        }
      });
    case 'audio-record-mode':
      return {
        ...state,
        recordAudioWhileHeld: !state.recordAudioWhileHeld,
      };
    case 'lock-sample-toggle':
      return produce(state, draftState => {
        const { locked } = draftState.samples[state.activeSampleId];
        if (locked.includes(state.activePattern)) {
          draftState.samples[state.activeSampleId].locked = locked.filter(
            pattern => pattern !== state.activePattern,
          );
        } else {
          draftState.samples[state.activeSampleId].locked.push(
            state.activePattern,
          );
        }
      });
    case 'sample-offset':
      return produce(state, draftState => {
        draftState.samples[state.activeSampleId].offset = Number(action.offset);

        // If we're not parameter locked, adjust offset for all pads.
        if (!parameterLocked()) {
          draftState.patterns[state.activePattern].forEach(pad => {
            pad.forEach(sound => {
              if (sound.id === state.activeSampleId) {
                sound.offset = action.offset;
              }
            });
          });
        }
      });
    default:
      throw new Error('Unknown dispatch action');
  }
}

const SoundPoolWrapper = styled(Box)`
  height: 100vh;
  overflow-y: auto;
  min-width: 200px;
`;

Tone.Transport.swingSubdivision = '16n';
// Tone.Transport.loop = true;
// Tone.Transport.loopEnd = '1';

const mutableState = {
  patterns: [],
  activePattern: 0,
};

const activeStep = State(0);

// Since each step will have a unique instance of 'sample', we can't call 'sample.restart'.
// Instead, on each iteration we'll retain a record of the previous play, by the id.
const prevSamples = {};

const loop = new Tone.Sequence(
  (time, step) => {
    mutableState.patterns[mutableState.activePattern][step].forEach(
      ({ id, sample, start, offset }) => {
        // stop previous instance of this sample *in any step prior to this one*
        if (prevSamples[id]) {
          prevSamples[id].stop();
        }
        sample.start(time + offset / 1000, start / 1000);
        prevSamples[id] = sample;
      },
    );
    Tone.Draw.schedule(() => {
      activeStep.set(step);
    });
  },
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  '16n',
);

loop.start();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasSamples = state.samples.length > 0;

  function togglePlay() {
    if (!hasSamples) {
      return;
    }
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
    Tone.Transport.swing = state.swing / 100;
    Tone.Transport.bpm.value = state.bpm;
    mutableState.activePattern = state.activePattern;
    mutableState.patterns = state.patterns;
  }, [state.bpm, state.swing, state.activePattern, state.patterns]);

  // useEffect(() => {
  //   Tone.Transport.scheduleOnce(time => {
  //     console.log(time);
  //     state.samples[0].sample.start();
  //   }, 0);
  // });

  return (
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
          {hasSamples && <SampleParameters state={state} dispatch={dispatch} />}
          <Pads
            state={state}
            dispatch={dispatch}
            activeStep={activeStep.get()}
          />
          <ContextParameters mode={state.mode} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default activeStep()(App);
