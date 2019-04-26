import React from 'react';
import { Flex } from 'rebass';
import Container from './Container';
import Pad from './Pad';

const padNames = [
  1,
  2,
  3,
  4,
  'q',
  'w',
  'e',
  'r',
  'a',
  's',
  'd',
  'f',
  'z',
  'x',
  'c',
  'v',
];

const Pads = props => {
  function padProps(pos) {
    return {
      name: padNames[pos],
      litPad: props.litPads.includes(pos),
      litIndicator: props.litIndicators.includes(pos),
      flashingIndicator: props.flashingIndicators.includes(pos),
      onPadPress: () => props.onPadPress(pos),
    };
  }

  return (
    <Container p={3} flexDirection="column">
      <Flex>
        <Pad {...padProps(0)} />
        <Pad {...padProps(1)} />
        <Pad {...padProps(2)} />
        <Pad {...padProps(3)} />
      </Flex>
      <Flex>
        <Pad {...padProps(4)} />
        <Pad {...padProps(5)} />
        <Pad {...padProps(6)} />
        <Pad {...padProps(7)} />
      </Flex>
      <Flex>
        <Pad {...padProps(8)} />
        <Pad {...padProps(9)} />
        <Pad {...padProps(10)} />
        <Pad {...padProps(11)} />
      </Flex>
      <Flex>
        <Pad {...padProps(12)} />
        <Pad {...padProps(13)} />
        <Pad {...padProps(14)} />
        <Pad {...padProps(15)} />
      </Flex>
    </Container>
  );
};

Pads.defaultProps = {
  litPads: [],
  litIndicators: [0],
};

export default Pads;
