import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersProps = {
  onChangeVolume: action('onChangeVolume'),
  volume: 100,
};

storiesOf('Components/SampleParameters', module).add('Default', () => (
  <SampleParameters {...SampleParametersProps} />
));
