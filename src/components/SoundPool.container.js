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

          const activeSoundIndex = state.samples.findIndex(
            sample => sample.id === state.activeSampleId,
          );
          const activeSound = state.samples.find(
            sample => sample.id === state.activeSampleId,
          );
          activeSound.sample.stop();

          if (key === 'up' && activeSoundIndex !== 0) {
            dispatch({
              type: 'active-sample',
              sampleId: state.samples[activeSoundIndex - 1].id,
            });

            state.samples[activeSoundIndex - 1].sample.start();
          }

          if (key === 'down' && activeSoundIndex + 1 < state.samples.length) {
            dispatch({
              type: 'active-sample',
              sampleId: state.samples[activeSoundIndex + 1].id,
            });
            state.samples[activeSoundIndex + 1].sample.start();
          }
        }}
      />
      <SoundPool
        activeSampleId={state.activeSampleId}
        onSoundPress={sampleId => {
          dispatch({ type: 'active-sample', sampleId });
        }}
        samples={state.samples}
        onAddSamples={event => {
          Array.from(event.target.files).forEach(file => {
            dispatch({
              type: 'add-sample',
              buffer: URL.createObjectURL(file),
              name: file.name,
            });
            // This also works:
            // const reader = new FileReader();
            // reader.readAsArrayBuffer(file);
            // reader.onload = onloadEvent => {
            //   const context = new AudioContext();
            //   context.decodeAudioData(onloadEvent.target.result, buffer => {
            //     dispatch({ type: 'add-sample', buffer, name: file.name });
            //   });
            // };
          });
        }}
      />
    </>
  );
};

export default SoundPoolContainer;
