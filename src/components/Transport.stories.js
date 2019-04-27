import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Transport from './Transport';

const TransportProps = {
  playing: boolean('Playing', false),
  pattern: number('Pattern', 0),
  onChangeBpm: action('onChangeBpm'),
  onChangeSwing: action('onChangeSwing'),
  onChangeMode: action('onChangeMode'),
  onTogglePlay: action('onTogglePlay'),
  mode: 'seq',
};

storiesOf('Components/Transport', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Transport {...TransportProps} />);
