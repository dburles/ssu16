export function sampleLengthToSeconds(sampleLength, sampleRate = 44.1) {
  return sampleLength / sampleRate / 1000;
}
