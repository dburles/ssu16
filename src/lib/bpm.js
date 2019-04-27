// Taken from https://github.com/bahamas10/node-bpm and modified.

let count = 0;
let ts = 0;
let old_ts = 0;
let first_ts;

const bpm = {
  tap() {
    const ret = {};
    ts = Date.now();
    if (!first_ts) {
      first_ts = ts;
    }

    // Ignore the first tap
    if (old_ts) {
      ret.avg = (60000 * count) / (ts - first_ts);
      ret.ms = ts - old_ts;
    }

    count = count + 1;
    ret.count = count;
    old_ts = ts;

    return ret;
  },
  reset() {
    count = 0;
    ts = 0;
    old_ts = 0;
    first_ts = 0;
  },
};

export default bpm;
