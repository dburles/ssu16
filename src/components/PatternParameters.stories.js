import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import PatternParameters from './PatternParameters';

const PatternParametersProps = {};

storiesOf('Components/PatternParameters', module).add('Default', () => (
  <PatternParameters {...PatternParametersProps} />
));
