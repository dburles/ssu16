import React, { useReducer, useEffect, useRef } from 'react';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import Metronome from '../samples/Metronome.flac';
import BassDrum1 from '../samples/Roland_TR-707/BassDrum1.wav';
// import BassDrum2 from '../samples/Roland_TR-707/BassDrum2.wav';
import CowBell from '../samples/Roland_TR-707/CowBell.wav';
// import Crash from '../samples/Roland_TR-707/Crash.wav';
import HandClap from '../samples/Roland_TR-707/HandClap.wav';
import HhC from '../samples/Roland_TR-707/HhC.wav';
// import HhO from '../samples/Roland_TR-707/HhO.wav';
// import HiTom from '../samples/Roland_TR-707/HiTom.wav';
// import LowTom from '../samples/Roland_TR-707/LowTom.wav';
// import MedTom from '../samples/Roland_TR-707/MedTom.wav';
// import Ride from '../samples/Roland_TR-707/Ride.wav';
import RimShot from '../samples/Roland_TR-707/RimShot.wav';
import Snare1 from '../samples/Roland_TR-707/Snare1.wav';
// import Snare2 from '../samples/Roland_TR-707/Snare2.wav';
import Tamb from '../samples/Roland_TR-707/Tamb.wav';
import ContextParameters from './ContextParameters.container';
import Help from './Help';
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
    volume: 60,
    start: 0,
    offset: 0,
    // Are the sample parameters locked?
    locked: false,
  };
}

const initialState = {
  samples: [
    { sample: BassDrum1, name: 'BassDrum1.wav' },
    { sample: CowBell, name: 'CowBell.wav' },
    { sample: HandClap, name: 'HandClap.wav' },
    // { sample: HhO, name: 'HhO.wav' },
    // { sample: LowTom, name: 'LowTom.wav' },
    // { sample: Ride, name: 'Ride.wav' },
    { sample: Snare1, name: 'Snare1.wav' },
    { sample: Tamb, name: 'Tamb.wav' },
    // { sample: BassDrum2, name: 'BassDrum2.wav' },
    // { sample: Crash, name: 'Crash.wav' },
    { sample: HhC, name: 'HhC.wav' },
    // { sample: HiTom, name: 'HiTom.wav' },
    // { sample: MedTom, name: 'MedTom.wav' },
    { sample: RimShot, name: 'RimShot.wav' },
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
  metronome: true,
  copyingPattern: false,
  copiedPatterns: [],
  activeStep: 0,
  help: false,
};

// Values shared with React state, but are referenced by
// tonejs callbacks through closure.
const mutableState = {
  patterns: [],
  patternChain: [0],
  activePattern: 0,
  active32Step: 0,
  liveRecordTime: undefined,
  metronome: true,
};

function volumeToDb(volume) {
  return Tone.gainToDb(Number(volume) / 100);
}

function reducer(state, action) {
  console.log(action);

  function parameterLocked() {
    return state.samples.find(sample => sample.id === state.activeSampleId)
      .locked;
  }

  // Updates all Tone.Player instances.for the active sound and pattern.
  function updateActiveSoundInActivePattern(updateFn) {
    return state.patterns.map((pattern, patternIndex) => {
      if (state.patternChain.includes(patternIndex)) {
        return pattern.map(step => {
          return step.map(sound => {
            if (sound.id === state.activeSampleId) {
              return {
                ...sound,
                ...updateFn(sound),
              };
            }
            return sound;
          });
        });
      }
      return pattern;
    });
  }

  function updateActiveSound(updateFn) {
    return state.samples.map(sound => {
      if (sound.id === state.activeSampleId) {
        return {
          ...sound,
          ...updateFn(sound),
        };
      }
      return sound;
    });
  }

  switch (action.type) {
    case 'play-toggle':
      return { ...state, playing: !state.playing };
    case 'bpm':
      return { ...state, bpm: action.bpm };
    case 'swing':
      return { ...state, swing: Number(action.swing) };
    case 'mode':
      return { ...state, mode: action.mode, chaining: false };
    case 'active-sample':
      return {
        ...state,
        activeSampleId: action.sampleId,
        lastPlayedPlaybackRate: 1,
      };
    case 'toggle-step':
      if (
        // Already active?
        state.patterns[state.activePattern][action.padId].some(
          sound => sound.id === state.activeSampleId,
        )
      ) {
        return {
          ...state,
          patterns: state.patterns.map((pattern, patternIndex) => {
            if (patternIndex === state.activePattern) {
              return pattern.map((step, stepIndex) => {
                if (stepIndex === action.padId) {
                  return step.filter(
                    sound => sound.id !== state.activeSampleId,
                  );
                }
                return step;
              });
            }
            return pattern;
          }),
        };
      } else {
        // Otherwise, add a new instance.
        const { buffer, volume, start, offset } = state.samples.find(
          sound => sound.id === state.activeSampleId,
        );
        const sample = new Tone.Player(buffer).toMaster();
        sample.volume.value = volumeToDb(volume);
        sample.playbackRate = state.lastPlayedPlaybackRate;

        const sound = {
          id: state.activeSampleId,
          sample,
          start,
          offset,
        };

        return {
          ...state,
          patterns: state.patterns.map((pattern, patternIndex) => {
            if (patternIndex === state.activePattern) {
              return pattern.map((step, stepIndex) => {
                if (stepIndex === action.padId) {
                  return [...step, sound];
                }
                return step;
              });
            }
            return pattern;
          }),
        };
      }
    case 'sample-volume':
      return {
        ...state,
        samples: updateActiveSound(sound => {
          sound.sample.volume.value = volumeToDb(action.volume);
          return { volume: action.volume };
        }),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(sound => {
            sound.sample.volume.value = volumeToDb(action.volume);
            return {
              sample: sound.sample,
            };
          }),
        }),
      };
    case 'playback-rate':
      return {
        ...state,
        lastPlayedPlaybackRate: action.lastPlayedPlaybackRate,
      };
    case 'set-active-pattern':
      return {
        ...state,
        activePattern: action.padId,
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
      return {
        ...state,
        samples: updateActiveSound(() => ({ start: Number(action.position) })),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(() => ({
            start: Number(action.position),
          })),
        }),
      };
    case 'audio-record-mode':
      return {
        ...state,
        recordAudioWhileHeld: !state.recordAudioWhileHeld,
      };
    case 'lock-sample-toggle':
      return {
        ...state,
        samples: updateActiveSound(sound => ({
          locked: !sound.locked,
        })),
      };
    case 'sample-offset':
      return {
        ...state,
        samples: updateActiveSound(() => ({ offset: Number(action.offset) })),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(() => ({
            offset: action.offset,
          })),
        }),
      };
    case 'delete-active-sound':
      return {
        ...state,
        activeSampleId: 0,
        samples: state.samples.filter(
          sound => sound.id !== state.activeSampleId,
        ),
      };
    case 'metronome-toggle':
      return {
        ...state,
        metronome: !state.metronome,
      };
    case 'copy-pattern-toggle':
      return state.copyingPattern
        ? {
            ...state,
            copyingPattern: false,
            copiedPatterns: [],
          }
        : {
            ...state,
            playing: false,
            patternChain: [state.activePattern],
            copyingPattern: true,
          };
    case 'copy-pattern-to':
      return state.copyingPattern
        ? {
            ...state,
            copiedPatterns: [
              ...new Set([...state.copiedPatterns, action.padId]),
            ],
            patterns: state.patterns.map((pattern, patternIndex) => {
              if (patternIndex === action.padId) {
                return [...state.patterns[state.activePattern]];
              }
              return pattern;
            }),
          }
        : state;
    case 'set-active-step':
      return {
        ...state,
        activeStep: action.step,
      };
    case 'help-toggle':
      return {
        ...state,
        help: !state.help,
      };
    default:
      throw new Error('Unknown dispatch action');
  }
}

Tone.Transport.swingSubdivision = '16n';
// Tone.Transport.loop = true;
// Tone.Transport.loopEnd = '1';

// Since each step will have a unique instance of 'sample', we can't call 'sample.restart'.
// Instead, on each iteration we'll retain a record of the previous play, by the id.
const prevSamples = {};

let prevStep = 0;
let prevTime = 0;
let currentTick = 0;
let patternChainPlaybackPos = 0;

const liveRecordCaptureLoop = new Tone.Loop(time => {
  currentTick = time;
}, '1i');

const metronomeLoop = new Tone.Loop(time => {
  if (mutableState.metronome) {
    metronome.start(time);
  }
}, '4n');

metronomeLoop.start();
liveRecordCaptureLoop.start();

const metronome = new Tone.Player(Metronome).toMaster();
metronome.volume.value = volumeToDb(60);

const loop = new Tone.Sequence(
  (time, step) => {
    if (mutableState.liveRecordTime !== undefined) {
      // console.log(mutableState.liveRecordTime, prevTime, time);
      const closestStep =
        Math.abs(mutableState.liveRecordTime - prevTime) <
        Math.abs(mutableState.liveRecordTime - time)
          ? // Closer to previous step.
            prevStep
          : // Closer to this step.
            step;

      dispatchEvent({ type: 'toggle-step', padId: closestStep });
      mutableState.liveRecordTime = undefined;
    }

    const currentPattern = mutableState.patternChain[patternChainPlaybackPos];

    if (step === 0) {
      dispatchEvent({ type: 'set-active-pattern', padId: currentPattern });
    }

    if (step === 15) {
      if (patternChainPlaybackPos === mutableState.patternChain.length - 1) {
        // We have reached the end of the pattern.
        patternChainPlaybackPos = 0;
      } else {
        // Move onto the next pattern.
        patternChainPlaybackPos += 1;
      }
    }

    mutableState.patterns[currentPattern][step].forEach(
      ({ id, sample, start, offset }) => {
        // Stop previous instance of this sample *in any step prior to this one*.
        if (prevSamples[id]) {
          prevSamples[id].stop();
        }
        sample.start(time + offset / 1000, start / 1000);
        prevSamples[id] = sample;
      },
    );

    Tone.Draw.schedule(() => {
      dispatchEvent({ type: 'set-active-step', step });
    }, time);
    prevTime = time;
    prevStep = step;

    // console.log(step, time);
  },
  [...Array(16).keys()],
  '16n',
);

loop.start();

let dispatchEvent;

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialMountRef = useRef(true);
  if (!dispatchEvent) {
    dispatchEvent = dispatch;
  }

  const hasSamples = state.samples.length > 0;

  useEffect(() => {
    if (!initialMountRef.current && hasSamples) {
      if (state.playing) {
        Tone.Transport.start();
      } else {
        Tone.Transport.stop();
        prevStep = 0;
        prevTime = 0;
        currentTick = 0;
        patternChainPlaybackPos = 0;
      }
    }

    initialMountRef.current = false;
  }, [hasSamples, state.playing]);

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = state.playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = 'fastest';
  }, []);

  useEffect(() => {
    Tone.Transport.swing = state.swing / 100;
    Tone.Transport.bpm.value = state.bpm;
  }, [state.bpm, state.swing]);

  // Sync with mutableState.
  useEffect(() => {
    mutableState.patterns = state.patterns;
    mutableState.patternChain = state.patternChain;
    mutableState.metronome = state.metronome;
  }, [state.metronome, state.patternChain, state.patterns]);

  useEffect(() => {
    mutableState.activePattern = state.activePattern;
  }, [state.activePattern]);

  return (
    <Flex m={1}>
      <SoundPool state={state} dispatch={dispatch} />

      <Flex flexDirection="column">
        <Box>
          <Transport
            state={state}
            dispatch={dispatch}
            togglePlay={() => {
              dispatch({ type: 'play-toggle' });
            }}
          />
        </Box>
        {state.help && <Help />}
        <Flex>
          {hasSamples && <SampleParameters state={state} dispatch={dispatch} />}
          <Pads
            state={state}
            dispatch={dispatch}
            onLiveRecord={() => {
              mutableState.liveRecordTime = currentTick;
            }}
          />
          <ContextParameters state={state} dispatch={dispatch} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default App;
