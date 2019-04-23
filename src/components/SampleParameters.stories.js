import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersProps = {};

storiesOf('Components/SampleParameters', module).add('Default', () => (
  <SampleParameters {...SampleParametersProps} />
));
