import React from 'react';
import SoundPool from './SoundPool';

const SoundPoolContainer = ({ dispatch, state }) => {
  return (
    <SoundPool
      activeSampleId={state.activeSampleId}
      onSoundPress={sampleId => {
        dispatch({ type: 'active-sample', sampleId });
      }}
      samples={state.samples}
    />
  );
};

export default SoundPoolContainer;
