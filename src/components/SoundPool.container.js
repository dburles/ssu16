import React from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { connect } from 'react-redux';
import { createSound } from '../lib/sound';
import SoundPool from './SoundPool';

const SoundPoolContainer = ({
  activeSampleId,
  dispatch,
  samples,
  soundPoolMuted,
}) => {
  return (
    <>
      <KeyboardEventHandler
        handleKeys={['up', 'down']}
        onKeyEvent={(key, event) => {
          event.preventDefault();

          const activeSoundIndex = samples.findIndex(
            sample => sample.id === activeSampleId,
          );

          if (
            (key === 'up' && activeSoundIndex === 0) ||
            (key === 'down' && activeSoundIndex + 1 === samples.length)
          ) {
            return;
          }

          const index =
            key === 'up' ? activeSoundIndex - 1 : activeSoundIndex + 1;

          if (!soundPoolMuted) {
            const activeSound = samples.find(
              sample => sample.id === activeSampleId,
            );
            activeSound.sample.stop();
            samples[index].sample.start();
          }

          dispatch({
            type: 'active-sample',
            sampleId: samples[index].id,
          });
        }}
      />
      <SoundPool
        activeSampleId={activeSampleId}
        onSoundPress={sampleId => {
          if (!soundPoolMuted) {
            const activeSound = samples.find(
              sample => sample.id === activeSampleId,
            );
            const pressedSound = samples.find(sample => sample.id === sampleId);

            activeSound.sample.stop();
            pressedSound.sample.start();
          }
          dispatch({ type: 'active-sample', sampleId });
        }}
        samples={samples}
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
        muted={soundPoolMuted}
      />
    </>
  );
};

export default connect(
  ({ activeSampleId, dispatch, samples, soundPoolMuted }) => ({
    activeSampleId,
    dispatch,
    samples,
    soundPoolMuted,
  }),
)(SoundPoolContainer);
