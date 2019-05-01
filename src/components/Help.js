import React from 'react';
import { Flex, Text } from 'rebass';
import Container from './Container';
import Space from './Space';

const Key = props => {
  return (
    <Text fontSize={1} color="silver">
      {props.children}
    </Text>
  );
};

const Item = props => {
  return (
    <Flex width={1} alignItems="center" flexDirection="column">
      <Key>{props.trigger}</Key>
      <Space mx={1} />
      <Text fontSize="12px" color="gray">
        {props.children}
      </Text>
    </Flex>
  );
};

const Help = () => {
  return (
    <Container p={3}>
      <Item trigger="Space">Play/Stop</Item>
      <Item trigger="&lt;">SEQ</Item>
      <Item trigger="&gt;">PAT</Item>
      <Item trigger="Arrow Up, Down">Soundpool</Item>
      <Item trigger="Shift + Pad">Sequence</Item>
      <Item trigger="L">Live Record</Item>
      <Item trigger="\">Tap BPM</Item>
      <Item trigger="M">Metronome</Item>
    </Container>
  );
};

export default Help;
