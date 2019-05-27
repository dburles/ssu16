import Tone from 'tone';
import bass from '../samples/lofi-hiphop/bass.wav';
import cello from '../samples/lofi-hiphop/cello.wav';
import rhodes from '../samples/lofi-hiphop/chord.wav';
import fx from '../samples/lofi-hiphop/fx.wav';
import hat1 from '../samples/lofi-hiphop/hat1.wav';
import hat2 from '../samples/lofi-hiphop/hat2.wav';
import hat3 from '../samples/lofi-hiphop/hat3.wav';
import hat4 from '../samples/lofi-hiphop/hat4.wav';
import insert from '../samples/lofi-hiphop/insert.wav';
import kayageum from '../samples/lofi-hiphop/kayageum.wav';
import kick1 from '../samples/lofi-hiphop/kick1.wav';
import kick2 from '../samples/lofi-hiphop/kick2.wav';
import kick3 from '../samples/lofi-hiphop/kick3.wav';
import kick4 from '../samples/lofi-hiphop/kick4.wav';
import paah from '../samples/lofi-hiphop/paah.wav';
import snare1 from '../samples/lofi-hiphop/snare1.wav';
import snare2 from '../samples/lofi-hiphop/snare2.wav';
import snare3 from '../samples/lofi-hiphop/snare3.wav';
import snare4 from '../samples/lofi-hiphop/snare4.wav';
import yo from '../samples/lofi-hiphop/yo.wav';
import Metronome from '../samples/Metronome.flac';
import bpmTap from './bpm';
import { calcStartOffset, calcDuration, volumeToDb } from './conversion';
import { createSound } from './sound';
import { mutableState } from './state';
import store from './store';

// Some overall compression to keep the levels in check
// const masterCompressor = new Tone.Compressor({
//   threshold: -6,
//   ratio: 3,
//   attack: 0.5,
//   release: 0.1,
// });
// Tone.Master.chain(masterCompressor);

export function loadInitialSamples() {
  const samples = [
    { buffer: bass, name: 'bass' },
    { buffer: rhodes, name: 'chord' },
    { buffer: fx, name: 'fx' },
    { buffer: hat1, name: 'hat1' },
    { buffer: hat2, name: 'hat2' },
    { buffer: hat3, name: 'hat3' },
    { buffer: hat4, name: 'hat4' },
    { buffer: kick1, name: 'kick1' },
    { buffer: kick2, name: 'kick2' },
    { buffer: kick3, name: 'kick3' },
    { buffer: kick4, name: 'kick4' },
    { buffer: snare1, name: 'snare1' },
    { buffer: snare2, name: 'snare2' },
    { buffer: snare3, name: 'snare3' },
    { buffer: snare4, name: 'snare4' },
    { buffer: cello, name: 'cello' },
    { buffer: kayageum, name: 'kayageum' },
    { buffer: insert, name: 'insert' },
    { buffer: paah, name: 'paah' },
    { buffer: yo, name: 'yo' },
  ].map(({ buffer, name }) => {
    const sound = createSound();
    return new Promise(resolve =>
      sound.player.load(buffer).then(() =>
        resolve({
          name,
          sound,
        }),
      ),
    );
  });

  // Load buffers in parallel.
  Promise.all(samples).then(loadedSamples => {
    loadedSamples.forEach(({ name, sound }) =>
      store.dispatch({ type: 'add-sound', name, sound }),
    );
  });
}

Tone.Transport.swingSubdivision = '16n';

// Since each step will have a unique instance of 'sample', we can't call 'sample.restart'.
// Instead, on each iteration we'll retain a record of the previous play, by the id.
const prevSamples = {};

const liveRecordCaptureLoop = new Tone.Loop(time => {
  mutableState.currentTick = time;
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
    store.dispatch({ type: 'set-active-pattern', padId: currentPattern });
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
        store.dispatch({ type: 'record-step', padId: closestStep });
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
          calcDuration(16 - duration),
        );
        prevSamples[id] = sample;
      },
    );

    Tone.Draw.schedule(() => {
      store.dispatch({ type: 'set-active-step', step });
    }, time);

    prevStep = step;
    prevTime = time;

    // console.log(step, time);
  },
  [...Array(16).keys()],
  '16n',
);

mainLoop.start();

export function start() {
  // https://github.com/Tonejs/Tone.js/wiki/Performance#scheduling-in-advance
  Tone.Transport.start('+0.1');
  bpmTap.reset();
}

export function stop() {
  Tone.Transport.stop();
  prevStep = 0;
  prevTime = 0;
  mutableState.currentTick = 0;
  mutableState.patternChainPlaybackPos = 0;
}
