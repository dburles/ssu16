import Tone from 'tone';
import { FILTER_MAX } from './constants';

export function sampleLengthToSeconds(sampleLength, sampleRate = 44.1) {
  return sampleLength / sampleRate / 1000;
}

export function calcStartOffset(start, sampleLength) {
  return start === 0 ? undefined : start * sampleLengthToSeconds(sampleLength);
}

export function calcDuration(duration) {
  return duration === 0 ? undefined : `${duration}n`;
}

export function volumeToDb(volume) {
  return Tone.gainToDb(Number(volume) / 100);
}

export function calcFrequency(n) {
  return (
    (FILTER_MAX - Math.sqrt(Math.pow(FILTER_MAX, 2) - Math.pow(n, 2))) * 20
  );
}
