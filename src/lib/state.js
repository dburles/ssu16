import bpmTap from './bpm';
import { volumeToDb } from './conversion';
import { transpose } from './pitch';
import { createSound, createSoundPoolInstance } from './sound';

export const initialState = {
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
export const mutableState = {
  patterns: [],
  patternChain: [0],
  activePattern: 0,
  active32Step: 0,
  liveRecordTime: undefined,
  metronome: false,
  patternChainPlaybackPos: 0,
  currentTick: 0,
};

// export function reducer(state, action) {
//   info('dispatch', action);
//   info('before', state);
//   const newState = reduce(state, action);
//   info('after', newState);
//   return newState;
// }

export function reducer(state = initialState, action) {
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
      return state;
  }
}
