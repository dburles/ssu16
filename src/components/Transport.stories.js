import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Transport from './Transport';

const TransportProps = {
  playing: boolean('Playing', false),
  pattern: number('Pattern', 1),
  onChange: action('onChange'),
  onChangeMode: action('onChangeMode'),
};

storiesOf('Components/Transport', module)
  .addDecorator(withKnobs)
  .add('Default', () => <Transport {...TransportProps} />);
