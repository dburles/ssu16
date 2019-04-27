import React from 'react';
import { Button, Box } from 'rebass';
import Container from './Container';
import Header from './Header';

const PatternParameters = props => {
  return (
    <Container flex={1} flexDirection="column">
      <Header>Patterns</Header>
      <Box p={3} pt={0}>
        <Button
          as="div"
          onClick={props.toggleCopy}
          fontSize={1}
          bg="transparent"
          border="1px solid"
          color="gray"
        >
          {props.copying ? 'DONE' : 'COPY'}
        </Button>
      </Box>
    </Container>
  );
};

export default PatternParameters;
