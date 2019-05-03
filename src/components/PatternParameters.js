import React from 'react';
import { Button, Box } from 'rebass';
import Container from './Container';
import Header from './Header';
import Space from './Space';

const PatternParameters = props => {
  return (
    <Container flex={1} flexDirection="column" py={3}>
      <Header>Patterns</Header>
      <Space py={2} />
      <Box p={3} pt={0}>
        <Button
          as="div"
          width={1}
          fontSize={1}
          border="1px solid"
          bg={props.copying ? 'red' : 'transparent'}
          borderColor={props.copying ? 'red' : 'gray'}
          color={props.copying ? 'white' : 'gray'}
          {...!props.chaining && { onClick: props.toggleCopy }}
        >
          {props.copying ? 'DONE' : 'COPY'}
        </Button>
      </Box>
      <Box p={3} pt={0}>
        <Button
          as="div"
          width={1}
          fontSize={1}
          border="1px solid"
          bg={props.chaining ? 'red' : 'transparent'}
          borderColor={props.chaining ? 'red' : 'gray'}
          color={props.chaining ? 'white' : 'gray'}
          {...!props.copying && { onClick: props.toggleChaining }}
        >
          {props.chaining ? 'DONE' : 'CHAIN'}
        </Button>
      </Box>
    </Container>
  );
};

export default PatternParameters;
