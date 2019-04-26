import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import Pad from './Pad';

const PadProps = {
  onPadPress: action('onPadPress'),
};

storiesOf('Components/Pad', module)
  .add('Default', () => <Pad {...PadProps} />)
  .add('Lit Indicator', () => <Pad {...PadProps} litIndicator />)
  .add('Flashing Indicator', () => <Pad {...PadProps} flashingIndicator />)
  .add('Lit Pad', () => <Pad {...PadProps} litPad />);
