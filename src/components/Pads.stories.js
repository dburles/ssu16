import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Pads from './Pads';

const PadsProps = {
  onPadPress: action('onPadPress'),
};

storiesOf('Components/Pads', module).add('Default', () => (
  <Pads {...PadsProps} />
));
