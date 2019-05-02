import React, { useReducer, useEffect, useRef } from 'react';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import bpmTap from '../lib/bpm';
import { calcStartOffset, calcDuration } from '../lib/conversion';
import info from '../lib/info';
import { transpose } from '../lib/pitch';
import Metronome from '../samples/Metronome.flac';
import Piano from '../samples/pianoc3.wav';
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

// Some overall compression to keep the levels in check
// const masterCompressor = new Tone.Compressor({
//   threshold: -6,
//   ratio: 3,
//   attack: 0.5,
//   release: 0.1,
// });
// Tone.Master.chain(masterCompressor);

const filterFreqDefault = 20000;

function createFilter() {
  return new Tone.Filter(filterFreqDefault, 'lowpass', -24);
}

function createReverb() {
  // Default: 1.5.
  const reverb = new Tone.Reverb(2);
  reverb.wet.value = 0;
  // This is async and we don't wait on it, but it shouldn't matter.
  reverb.generate();
  return reverb;
}

function createPanner() {
  return new Tone.Panner();
}

export function createSound(buffer) {
  const player = new Tone.Player(buffer);

  // Eliminate clicks.
  player.fadeIn = 0.001;
  player.fadeOut = 0.001;

  const filter = createFilter();
  const panner = createPanner();
  const reverb = createReverb();

  player.chain(panner, filter, reverb, Tone.Master);

  return { player, filter, panner, reverb };
}

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
    { buffer: Piano, name: 'Piano.wav' },
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
    const sound = createSound();
    await sound.player.load(buffer);
    dispatchEvent({ type: 'add-sound', sound, name });
  });
}

// This creates a sound instance to be added into the sound pool.
function createSoundPoolInstance(sound, name, id) {
  const volume = 60;
  sound.player.volume.value = volumeToDb(volume);

  return {
    id,
    sample: sound.player, // TODO: Rename to 'player'.
    name,
    volume,
    start: 0,
    offset: 0,
    // A division of 16th's, 0-16. 0 represents no limit.
    duration: 0,
    // Are the sample parameters locked?
    locked: false,
    panner: sound.panner,
    pan: 0,
    filter: sound.filter,
    filterFreq: filterFreqDefault,
    reverb: sound.reverb,
    reverbWet: 0,
    // between -24...+24
    pitch: 0,
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
  help: false,
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
  metronome: false,
  patternChainPlaybackPos: 0,
};

function volumeToDb(volume) {
  return Tone.gainToDb(Number(volume) / 100);
}

function reducer(currentState, action) {
  info('dispatch', action);
  info('before', currentState);
  const state = reduce(currentState, action);
  info('after', state);
  return state;
}

function reduce(state, action) {
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

  // Similar to a soundpool instance, however it's specific to each 'step'.
  function addSoundToStep() {
    const {
      sample,
      volume,
      start,
      offset,
      duration,
      pan,
      filterFreq,
      reverbWet,
    } = state.samples.find(sound => sound.id === state.activeSampleId);

    // Create a new set of Tone instances and copy values across.
    const sound = createSound(sample.buffer);
    sound.player.volume.value = volumeToDb(volume);
    sound.player.playbackRate = state.lastPlayedPlaybackRate;
    sound.panner.pan.value = pan;
    sound.filter.frequency.value = filterFreq;
    sound.reverb.wet.value = reverbWet;

    const instance = {
      id: state.activeSampleId,
      sample: sound.player, // TODO: Rename to 'player'.
      start,
      offset,
      duration,
      pan,
      panner: sound.panner,
      filterFreq,
      filter: sound.filter,
      reverb: sound.reverb,
      reverbWet,
      originalPlaybackRate: state.lastPlayedPlaybackRate,
    };

    return {
      ...state,
      patterns: state.patterns.map((pattern, patternIndex) => {
        if (patternIndex === state.activePattern) {
          return pattern.map((step, stepIndex) => {
            if (stepIndex === action.padId) {
              return [...step, instance];
            }
            return step;
          });
        }
        return pattern;
      }),
    };
  }

  switch (action.type) {
    case 'play-toggle': {
      if (state.playing) {
        state.patterns.forEach(pattern =>
          pattern.forEach(step => step.forEach(sound => sound.sample.stop())),
        );
      } else {
        // Stop the audiopool preview if it's playing
        state.samples[state.activeSampleId].sample.stop();
      }
      return { ...state, playing: !state.playing };
    }
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
            return { sample: sound.sample };
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
    case 'add-sound':
      return {
        ...state,
        samples: [
          ...state.samples,
          createSoundPoolInstance(
            action.sound,
            action.name,
            state.samples.length,
          ),
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
        patterns: initialState.patterns,
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
    case 'sound-pan': {
      const pan = Number(action.pan);
      return {
        ...state,
        samples: updateActiveSound(sound => {
          sound.panner.pan.value = pan;
          return { pan };
        }),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(sound => {
            sound.panner.pan.value = pan;
            return { pan };
          }),
        }),
      };
    }
    case 'sound-filter-freq': {
      const filterFreq = Number(action.freq);
      return {
        ...state,
        samples: updateActiveSound(sound => {
          sound.filter.frequency.value = filterFreq;
          return { filterFreq };
        }),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(sound => {
            sound.filter.frequency.value = filterFreq;
            return { filterFreq };
          }),
        }),
      };
    }
    case 'sound-reverb-wet': {
      const reverbWet = Number(action.wet);
      return {
        ...state,
        samples: updateActiveSound(sound => {
          sound.reverb.wet.value = reverbWet;
          return { reverbWet };
        }),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(sound => {
            sound.reverb.wet.value = reverbWet;
            return { reverbWet };
          }),
        }),
      };
    }
    case 'sound-pitch': {
      const pitch = Number(action.pitch);
      return {
        ...state,
        samples: updateActiveSound(() => ({
          pitch,
        })),
        ...(!parameterLocked() && {
          patterns: updateActiveSoundInActivePattern(sound => {
            sound.sample.playbackRate = transpose(
              sound.originalPlaybackRate,
              pitch,
            );
            return { pitch };
          }),
        }),
      };
    }
    default:
      throw new Error('Unknown dispatch action');
  }
}

Tone.Transport.swingSubdivision = '16n';

// Since each step will have a unique instance of 'sample', we can't call 'sample.restart'.
// Instead, on each iteration we'll retain a record of the previous play, by the id.
const prevSamples = {};

let currentTick = 0;

const liveRecordCaptureLoop = new Tone.Loop(time => {
  currentTick = time;
}, '1i');

liveRecordCaptureLoop.start();

const metronome = new Tone.Player(Metronome).toMaster();
metronome.volume.value = volumeToDb(40);

const metronomeLoop = new Tone.Loop(time => {
  if (mutableState.metronome) {
    metronome.start(time);
  }
}, '4n');

metronomeLoop.start();

let currentPattern = 0;

const patternPlaybackLoop = new Tone.Loop(time => {
  currentPattern =
    mutableState.patternChain[mutableState.patternChainPlaybackPos];

  Tone.Draw.schedule(() => {
    dispatchEvent({ type: 'set-active-pattern', padId: currentPattern });
  }, time);

  if (
    mutableState.patternChainPlaybackPos ===
    mutableState.patternChain.length - 1
  ) {
    // We have reached the end of the pattern chain.
    mutableState.patternChainPlaybackPos = 0;
  } else {
    // Move onto the next pattern.
    mutableState.patternChainPlaybackPos += 1;
  }
}, '1n');

patternPlaybackLoop.start();

let prevStep = 0;
let prevTime = 0;

const mainLoop = new Tone.Sequence(
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

      Tone.Draw.schedule(() => {
        dispatchEvent({ type: 'record-step', padId: closestStep });
      }, time);

      mutableState.liveRecordTime = undefined;
    }

    mutableState.patterns[currentPattern][step].forEach(
      ({ id, sample, start, offset, duration }) => {
        // Stop previous instance of this sample *in any step prior to this one*.
        if (prevSamples[id]) {
          prevSamples[id].stop();
        }
        sample.start(
          time + offset / 1000,
          calcStartOffset(start, sample.buffer.length),
          calcDuration(duration),
        );
        prevSamples[id] = sample;
      },
    );

    Tone.Draw.schedule(() => {
      dispatchEvent({ type: 'set-active-step', step });
    }, time);

    prevStep = step;
    prevTime = time;

    // console.log(step, time);
  },
  [...Array(16).keys()],
  '16n',
);

mainLoop.start();

function start() {
  // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
  Tone.Transport.start('+0.1');
  bpmTap.reset();
}

function stop() {
  Tone.Transport.stop();
  prevStep = 0;
  prevTime = 0;
  currentTick = 0;
  mutableState.patternChainPlaybackPos = 0;
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
        start();
      } else {
        stop();
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
    bpmTap.reset();
  }, [state.bpm, state.swing]);

  // Sync with mutableState.
  // It's important that they are each self-contained,
  // otherwise re-assigning unchanged values can cause funkyness.
  useEffect(() => {
    mutableState.patterns = state.patterns;
  }, [state.patterns]);
  useEffect(() => {
    mutableState.patternChain = state.patternChain;
  }, [state.patternChain]);
  useEffect(() => {
    mutableState.metronome = state.metronome;
  }, [state.metronome]);
  useEffect(() => {
    mutableState.patternChainPlaybackPos = state.patternChainPlaybackPos;
  }, [state.patternChainPlaybackPos]);
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

        <Flex style={{ height: '550px' }}>
          <SoundPool state={state} dispatch={dispatch} />

          <SampleParameters
            state={state}
            dispatch={dispatch}
            disabled={!hasSamples}
          />

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
