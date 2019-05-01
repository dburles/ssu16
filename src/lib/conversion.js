export function sampleLengthToSeconds(sampleLength, sampleRate = 44.1) {
  return sampleLength / sampleRate / 1000;
}

export function startOffset(start, sampleLength) {
  return start === 0 ? undefined : start * sampleLengthToSeconds(sampleLength);
}
