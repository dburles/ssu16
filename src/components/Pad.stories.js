import { storiesOf } from '@storybook/react';
import React from 'react';
import Pad from './Pad';

storiesOf('Components/Pad', module)
  .add('Default', () => <Pad />)
  .add('Lit Indicator', () => <Pad litIndicator />)
  .add('Lit Pad', () => <Pad litPad />);
