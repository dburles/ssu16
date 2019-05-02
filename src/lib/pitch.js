// C0 - B8
const freqTable = [
  16.35,
  17.32,
  18.35,
  19.45,
  20.6,
  21.83,
  23.12,
  24.5,
  25.96,
  27.5,
  29.14,
  30.87,
  32.7,
  34.65,
  36.71,
  38.89,
  41.2,
  43.65,
  46.25,
  49.0,
  51.91,
  55.0,
  58.27,
  61.74,
  65.41,
  69.3,
  73.42,
  77.78,
  82.41,
  87.31,
  92.5,
  98.0,
  103.83,
  110.0,
  116.54,
  123.47,
  130.81,
  138.59,
  146.83,
  155.56,
  164.81,
  174.61,
  185.0,
  196.0,
  207.65,
  220.0,
  233.08,
  246.94,
  261.63,
  277.18,
  293.66,
  311.13,
  329.63,
  349.23,
  369.99,
  392.0,
  415.3,
  440.0,
  466.16,
  493.88,
  523.25,
  554.37,
  587.33,
  622.25,
  659.26,
  698.46,
  739.99,
  783.99,
  830.61,
  880.0,
  932.33,
  987.77,
  1046.5,
  1108.73,
  1174.66,
  1244.51,
  1318.51,
  1396.91,
  1479.98,
  1567.98,
  1661.22,
  1760.0,
  1864.66,
  1975.53,
  2093.0,
  2217.46,
  2349.32,
  2489.02,
  2637.02,
  2793.83,
  2959.96,
  3135.96,
  3322.44,
  3520.0,
  3729.31,
  3951.07,
  4186.01,
  4434.92,
  4698.64,
  4978.03,
  5274.04,
  5587.65,
  5919.91,
  6271.93,
  6644.88,
  7040.0,
  7458.62,
  7902.1,
];

function coefficient(freq) {
  return freq / 440;
}

const coefficientTable = freqTable.map(coefficient);

export function generateChromaticMap(center = 0) {
  // 57 = array key for 440.
  const mapCenter = 57 + center;

  // Generate 8 notes lower.
  function generateLow() {
    const low = [];
    let i = 1;
    while (i <= 8) {
      const freq = freqTable[mapCenter - i];
      low.push(freq);
      i += 1;
    }

    return low;
  }

  // Generate 7 notes higher.
  function generateHigh() {
    const high = [];
    let i = 1;
    while (i <= 7) {
      const freq = freqTable[mapCenter + i];
      high.push(freq);
      i += 1;
    }

    return high.reverse();
  }

  const fMap = [...generateHigh(), freqTable[mapCenter], ...generateLow()];

  // prettier-ignore
  const padMapFrequencies = [
    fMap[3],  fMap[2],  fMap[1],  fMap[0],
    fMap[7],  fMap[6],  fMap[5],  fMap[4],
    fMap[11], fMap[10], fMap[9],  fMap[8],
    fMap[15], fMap[14], fMap[13], fMap[12],
  ];

  const coefficientMap = padMapFrequencies.map(freq => coefficient(freq));

  return coefficientMap;
}

export function transpose(coefficient, pitch) {
  const index = coefficientTable.findIndex(n => n === coefficient);
  return coefficientTable[index + pitch];
}
