import React, { useReducer, useEffect, useRef } from 'react';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import bpmTap from '../lib/bpm';
import { sampleLengthToSeconds } from '../lib/conversion';
import Metronome from '../samples/Metronome.flac';
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
// import BDHEAVY from '../samples/RX11/BD HEAVY.wav';
// import BDMD1 from '../samples/RX11/BD MD 1.wav';
// import BDMD2 from '../samples/RX11/BD MD 2.wav';
// import CLAPS1 from '../samples/RX11/CLAPS 1.wav';
// import CLAPS2 from '../samples/RX11/CLAPS 2.wav';
// import COWBELL1 from '../samples/RX11/COWBELL 1.wav';
// import COWBELL2 from '../samples/RX11/COWBELL 2.wav';
// import HHCLOSED1 from '../samples/RX11/HH CLOSED 1.wav';
// import HHCLOSED2 from '../samples/RX11/HH CLOSED 2.wav';
// import HHCLOSEDPEDAL from '../samples/RX11/HH CLOSED PEDAL.wav';
// import HHOPEN1 from '../samples/RX11/HH OPEN 1.wav';
// import HHOPEN2 from '../samples/RX11/HH OPEN 2.wav';
// import RIMSHOT1 from '../samples/RX11/RIMSHOT 1.wav';
// import RIMSHOT2 from '../samples/RX11/RIMSHOT 2.wav';
// import SDHEAVY from '../samples/RX11/SD HEAVY.wav';
// import SDHITUNE1 from '../samples/RX11/SD HI TUNE 1.wav';
// import SDHITUNE2 from '../samples/RX11/SD HI TUNE 2.wav';
// import SDHITUNE3 from '../samples/RX11/SD HI TUNE 3.wav';
// import SDHITUNE4 from '../samples/RX11/SD HI TUNE 4.wav';
// import SDHITUNE5 from '../samples/RX11/SD HI TUNE 5.wav';
// import SDLIGHT from '../samples/RX11/SD LIGHT.wav';
// import SDMEDIUM from '../samples/RX11/SD MEDIUM.wav';
// import SHAKER from '../samples/RX11/SHAKER.wav';
// import TOM1 from '../samples/RX11/TOM 1.wav';
// import TOM2 from '../samples/RX11/TOM 2.wav';
// import TOM3 from '../samples/RX11/TOM 3.wav';
// import TOM4 from '../samples/RX11/TOM 4.wav';
import ContextParameters from './ContextParameters.container';
import Help from './Help';
import Pads from './Pads.container';
import SampleParameters from './SampleParameters.container';
import SoundPool from './SoundPool.container';
import Transport from './Transport.container';

let dispatchEvent;

function loadInitialSamples() {
  return [
    { buffer: BassDrum1, name: 'BassDrum1.wav' },
    { buffer: BassDrum2, name: 'BassDrum2.wav' },
    { buffer: CowBell, name: 'CowBell.wav' },
    { buffer: Crash, name: 'Crash.wav' },
    { buffer: HandClap, name: 'HandClap.wav' },
    { buffer: HhC, name: 'HhC.wav' },
    { buffer: HhO, name: 'HhO.wav' },
    { buffer: HiTom, name: 'HiTom.wav' },
    { buffer: LowTom, name: 'LowTom.wav' },
    { buffer: MedTom, name: 'MedTom.wav' },
    { buffer: Ride, name: 'Ride.wav' },
    { buffer: RimShot, name: 'RimShot.wav' },
    { buffer: Snare1, name: 'Snare1.wav' },
    { buffer: Snare2, name: 'Snare2.wav' },
    { buffer: Tamb, name: 'Tamb.wav' },
    // { buffer: Snare2, name: 'Snare2.wav' },
    // { buffer: BDHEAVY, name: 'BD HEAVY.wav' },
    // { buffer: BDMD1, name: 'BD MD 1.wav' },
    // { buffer: BDMD2, name: 'BD MD 2.wav' },
    // { buffer: CLAPS1, name: 'CLAPS 1.wav' },
    // { buffer: CLAPS2, name: 'CLAPS 2.wav' },
    // { buffer: COWBELL1, name: 'COWBELL 1.wav' },
    // { buffer: COWBELL2, name: 'COWBELL 2.wav' },
    // { buffer: HHCLOSED1, name: 'HH CLOSED 1.wav' },
    // { buffer: HHCLOSED2, name: 'HH CLOSED 2.wav' },
    // { buffer: HHCLOSEDPEDAL, name: 'HH CLOSED PEDAL.wav' },
    // { buffer: HHOPEN1, name: 'HH OPEN 1.wav' },
    // { buffer: HHOPEN2, name: 'HH OPEN 2.wav' },
    // { buffer: RIMSHOT1, name: 'RIMSHOT 1.wav' },
    // { buffer: RIMSHOT2, name: 'RIMSHOT 2.wav' },
    // { buffer: SDHEAVY, name: 'SD HEAVY.wav' },
    // { buffer: SDHITUNE1, name: 'SD HI TUNE 1.wav' },
    // { buffer: SDHITUNE2, name: 'SD HI TUNE 2.wav' },
    // { buffer: SDHITUNE3, name: 'SD HI TUNE 3.wav' },
    // { buffer: SDHITUNE4, name: 'SD HI TUNE 4.wav' },
    // { buffer: SDHITUNE5, name: 'SD HI TUNE 5.wav' },
    // { buffer: SDLIGHT, name: 'SD LIGHT.wav' },
    // { buffer: SDMEDIUM, name: 'SD MEDIUM.wav' },
    // { buffer: SHAKER, name: 'SHAKER.wav' },
    // { buffer: TOM1, name: 'TOM 1.wav' },
    // { buffer: TOM2, name: 'TOM 2.wav' },
    // { buffer: TOM3, name: 'TOM 3.wav' },
    // { buffer: TOM4, name: 'TOM 4.wav' },
  ].forEach(async ({ buffer, name }) => {
    const sample = new Tone.Player().toMaster();
    await sample.load(buffer);
    dispatchEvent({ type: 'add-sample', sample, name });
  });
}

function createSample(sample, name, id) {
  const volume = 60;
  const { buffer } = sample;
  sample.volume.value = volumeToDb(volume);

  return {
    id,
    sample,
    buffer,
    name,
    volume,
    start: 0,
    offset: 0,
    // A division of 16th's, 0-16. 0 represents no limit.
    duration: 0,
    // Are the sample parameters locked?
    locked: false,
  };
}

const initialState = {
  samples: [],
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
  metronome: false,
  copyingPattern: false,
  copiedPatterns: [],
  activeStep: 0,
  help: true,
  soundPoolMuted: false,
  patternChainPlaybackPos: 0,
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
  patternChainPlaybackPos: 0,
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

  function addSoundToStep() {
    const { buffer, volume, start, offset, duration } = state.samples.find(
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
      duration,
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
    case 'record-step':
      if (
        state.playing &&
        state.recordingPrf &&
        !state.patterns[state.activePattern][action.padId].some(
          sound => sound.id === state.activeSampleId,
        )
      ) {
        // Not already active?
        return addSoundToStep();
      }
      return state;
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
      }
      // Otherwise, add a new instance.
      return addSoundToStep();
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
        patternChainPlaybackPos: 0,
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
          createSample(action.sample, action.name, state.samples.length),
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
            offset: Number(action.offset),
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
        // Remove all instances of this sound.
        patterns: state.patterns.map(pattern => {
          return pattern.map(step => {
            return step.filter(sound => sound.id !== state.activeSampleId);
          });
        }),
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
    case 'delete-all-sound':
      return {
        ...state,
        patterns: [],
        activePattern: 0,
        samples: [],
        activeSampleId: 0,
      };
    case 'soundpool-mute-toggle':
      return {
        ...state,
        soundPoolMuted: !state.soundPoolMuted,
      };
    case 'bpm-tap': {
      const { avg } = bpmTap.tap();
      return {
        ...state,
        bpm: avg ? Math.round(avg) : state.bpm,
      };
    }
    case 'sound-duration':
      return {
        ...state,
        samples: updateActiveSound(() => ({
          duration: Number(action.duration),
        })),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(() => ({
            duration: Number(action.duration),
          })),
        }),
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

const liveRecordCaptureLoop = new Tone.Loop(time => {
  currentTick = time;
}, '1i');

// const metronomeLoop = new Tone.Loop(time => {
//   if (mutableState.metronome) {
//     metronome.start(time);
//   }
// }, '4n');

// metronomeLoop.start();
liveRecordCaptureLoop.start();

const metronome = new Tone.Player(Metronome).toMaster();
metronome.volume.value = volumeToDb(40);

const loop = new Tone.Sequence(
  (time, step) => {
    if (mutableState.metronome && step % 4 === 0) {
      metronome.start(time);
    }

    if (mutableState.liveRecordTime !== undefined) {
      // console.log(mutableState.liveRecordTime, prevTime, time);
      const closestStep =
        Math.abs(mutableState.liveRecordTime - prevTime) <
        Math.abs(mutableState.liveRecordTime - time)
          ? // Closer to previous step.
            prevStep
          : // Closer to this step.
            step;

      Tone.Draw.schedule(() => {
        dispatchEvent({ type: 'record-step', padId: closestStep });
      }, time);

      mutableState.liveRecordTime = undefined;
    }

    const currentPattern =
      mutableState.patternChain[mutableState.patternChainPlaybackPos];

    if (step === 0) {
      Tone.Draw.schedule(() => {
        dispatchEvent({ type: 'set-active-pattern', padId: currentPattern });
      }, time);
    }

    if (step === 15) {
      if (
        mutableState.patternChainPlaybackPos ===
        mutableState.patternChain.length - 1
      ) {
        // We have reached the end of the pattern.
        mutableState.patternChainPlaybackPos = 0;
      } else {
        // Move onto the next pattern.
        mutableState.patternChainPlaybackPos += 1;
      }
    }

    mutableState.patterns[currentPattern][step].forEach(
      ({ id, sample, start, offset, duration }) => {
        // Stop previous instance of this sample *in any step prior to this one*.
        if (prevSamples[id]) {
          prevSamples[id].stop();
        }
        sample.start(
          time + offset / 1000,
          start === 0
            ? undefined
            : start * sampleLengthToSeconds(sample.buffer.length),
          duration === 0 ? undefined : `${duration}n`,
        );
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

function start(state) {
  // Stop the audiopool preview if it's playing
  state.samples[state.activeSampleId].sample.stop();
  // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
  Tone.Transport.start('+0.1');
  bpmTap.reset();
}

function stop(state) {
  Tone.Transport.stop();
  stopAllSounds(state);
  prevStep = 0;
  prevTime = 0;
  currentTick = 0;
  mutableState.patternChainPlaybackPos = 0;
}

function stopAllSounds(state) {
  state.patterns.forEach(pattern =>
    pattern.forEach(step => step.forEach(sound => sound.sample.stop())),
  );
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialMountRef = useRef(true);
  if (!dispatchEvent) {
    dispatchEvent = dispatch;
  }

  const hasSamples = state.samples.length > 0;

  useEffect(() => {
    loadInitialSamples();
  }, []);

  useEffect(() => {
    if (!initialMountRef.current && hasSamples) {
      if (state.playing) {
        start(state);
      } else {
        stop(state);
      }
    }

    initialMountRef.current = false;
  }, [hasSamples, state, state.playing]);

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = state.playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = 'fastest';
  }, []);

  useEffect(() => {
    Tone.Transport.swing = state.swing / 100;
    Tone.Transport.bpm.value = state.bpm;
    bpmTap.reset();
  }, [state.bpm, state.swing]);

  // Sync with mutableState.
  useEffect(() => {
    mutableState.patterns = state.patterns;
    mutableState.patternChain = state.patternChain;
    mutableState.metronome = state.metronome;
    mutableState.patternChainPlaybackPos = state.patternChainPlaybackPos;
  }, [
    state.metronome,
    state.patternChain,
    state.patternChainPlaybackPos,
    state.patterns,
  ]);

  useEffect(() => {
    mutableState.activePattern = state.activePattern;
  }, [state.activePattern]);

  return (
    <Flex m={1} justifyContent="center">
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

        <Flex style={{ maxHeight: '500px' }}>
          <SoundPool state={state} dispatch={dispatch} />
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

        {state.help && <Help />}
      </Flex>
    </Flex>
  );
};

export default App;
