import React from 'react';
import { Box } from 'rebass';
import Container from './Container';
import Input from './Input';
import Title from './Title';

const SampleParameters = props => {
  return (
    <Container p={3}>
      <Box p={3}>
        <Title>Volume</Title>
        <Input
          type="number"
          min={0}
          max={100}
          value={props.volume}
          onChange={props.onChangeVolume}
        />
      </Box>
      <Box p={3}>
        <Title>Pitch</Title>
        <Input type="number" min={0} max={100} />
      </Box>
    </Container>
  );
};

export default SampleParameters;
