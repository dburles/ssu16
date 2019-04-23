import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import SoundPool from './SoundPool';

const SoundPoolContainer = ({ dispatch, state }) => {
  return (
    <>
      <KeyboardEventHandler
        handleKeys={['up', 'down']}
        onKeyEvent={(key, event) => {
          event.preventDefault();

          if (key === 'up' && state.activeSampleId !== 0) {
            dispatch({
              type: 'active-sample',
              sampleId: state.activeSampleId - 1,
            });
          }

          if (
            key === 'down' &&
            state.activeSampleId + 1 < state.samples.length
          ) {
            dispatch({
              type: 'active-sample',
              sampleId: state.activeSampleId + 1,
            });
          }
        }}
      />
      <SoundPool
        activeSampleId={state.activeSampleId}
        onSoundPress={sampleId => {
          dispatch({ type: 'active-sample', sampleId });
        }}
        samples={state.samples}
      />
    </>
  );
};

export default SoundPoolContainer;
