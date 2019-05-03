import Tone from 'tone';
import { volumeToDb } from './conversion';

// This creates a sound instance to be added into the sound pool.
export function createSoundPoolInstance(sound, name, id) {
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
