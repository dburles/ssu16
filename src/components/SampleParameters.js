import React from 'react';
import { Flex, Box } from 'rebass';
import Container from './Container';
import Input from './Input';
import Title from './Title';

const SampleParameters = props => {
  return (
    <Container p={3}>
      <Box width={1 / 2} p={3}>
        <Title>Volume</Title>
        <Input type="number" min={0} max={100} value={props.volume} />
      </Box>
      <Box width={1 / 2} p={3}>
        <Title>Pitch</Title>
        <Input type="number" min={0} max={100} />
      </Box>
    </Container>
  );
};

export default SampleParameters;
