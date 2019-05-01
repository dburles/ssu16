import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { createSound } from './App';
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

          if (
            (key === 'up' && activeSoundIndex === 0) ||
            (key === 'down' && activeSoundIndex + 1 === state.samples.length)
          ) {
            return;
          }

          const index =
            key === 'up' ? activeSoundIndex - 1 : activeSoundIndex + 1;

          if (!state.soundPoolMuted) {
            const activeSound = state.samples.find(
              sample => sample.id === state.activeSampleId,
            );
            activeSound.sample.stop();
            state.samples[index].sample.start();
          }

          dispatch({
            type: 'active-sample',
            sampleId: state.samples[index].id,
          });
        }}
      />
      <SoundPool
        activeSampleId={state.activeSampleId}
        onSoundPress={sampleId => {
          if (!state.soundPoolMuted) {
            const activeSound = state.samples.find(
              sample => sample.id === state.activeSampleId,
            );
            const pressedSound = state.samples.find(
              sample => sample.id === sampleId,
            );

            activeSound.sample.stop();
            pressedSound.sample.start();
          }
          dispatch({ type: 'active-sample', sampleId });
        }}
        samples={state.samples}
        onAddSamples={event => {
          Array.from(event.target.files).forEach(async file => {
            const sound = createSound();
            await sound.player.load(URL.createObjectURL(file));
            dispatch({
              type: 'add-sound',
              sound,
              name: file.name,
            });
            // This also works:
            // const reader = new FileReader();
            // reader.readAsArrayBuffer(file);
            // reader.onload = onloadEvent => {
            //   const context = new AudioContext();
            //   context.decodeAudioData(onloadEvent.target.result, buffer => {
            //     dispatch({ type: 'add-sound', buffer, name: file.name });
            //   });
            // };
          });
        }}
        onDelete={() => {
          if (
            confirm(
              'Are you sure you wish to clear the sound pool and erase all patterns?',
            )
          ) {
            dispatch({ type: 'delete-all-sound' });
          }
        }}
        onMute={() => {
          dispatch({ type: 'soundpool-mute-toggle' });
        }}
        muted={state.soundPoolMuted}
      />
    </>
  );
};

export default SoundPoolContainer;
