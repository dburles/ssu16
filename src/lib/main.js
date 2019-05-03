import Tone from 'tone';
import Rhodes from '../samples/chord.wav';
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
import bpmTap from './bpm';
import { calcStartOffset, calcDuration, volumeToDb } from './conversion';
import { createSound } from './sound';
import { mutableState } from './state';
import store from './store';
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

// Some overall compression to keep the levels in check
// const masterCompressor = new Tone.Compressor({
//   threshold: -6,
//   ratio: 3,
//   attack: 0.5,
//   release: 0.1,
// });
// Tone.Master.chain(masterCompressor);

export function loadInitialSamples() {
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
    { buffer: Rhodes, name: 'Rhodes.wav' },
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
    store.dispatch({ type: 'add-sound', sound, name });
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
          calcDuration(duration),
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
