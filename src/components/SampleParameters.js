import React from 'react';
import { Box, Flex } from 'rebass';
import Container from './Container';
import Input from './Input';
import Title from './Title';

const SampleParameters = props => {
  return (
    <Container flexDirection="column">
      <Box p={3}>
        <Title>Volume</Title>
        <Input
          type="range"
          min={0}
          max={100}
          value={props.volume}
          onChange={props.onChangeVolume}
          width={1}
        />
      </Box>
      <Box p={3}>
        <Title>Pitch</Title>
        <Input type="number" min={0} max={100} width={1} />
      </Box>
      <Box p={3}>
        <Title>Start</Title>
        <Input
          type="number"
          min={0}
          value={props.startPoint}
          onChange={props.onChangeStartPoint}
          width={1}
        />
      </Box>
      <Box p={3}>
        <Title>End</Title>
        <Input type="number" min={0} width={1} />
      </Box>
    </Container>
  );
};

export default SampleParameters;
