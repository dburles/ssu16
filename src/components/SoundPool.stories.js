import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import SoundPool from './SoundPool';

const SoundPoolProps = {
  samples: [
    {
      id: 0,
      name: 'kick.wav',
    },
    {
      id: 1,
      name: 'snare.wav',
    },
  ],
  onAddSamples: action('onAddSamples'),
  onSoundPress: action('onSoundPress'),
};

storiesOf('Components/SoundPool', module)
  .add('Default', () => <SoundPool {...SoundPoolProps} />)
  .add('Selected Sound', () => (
    <SoundPool {...SoundPoolProps} activeSampleId={1} />
  ));
