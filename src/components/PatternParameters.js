import React from 'react';
import { Button, Box } from 'rebass';
import Container from './Container';

const PatternParameters = props => {
  return (
    <Container p={3}>
      <Box>
        <Button
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
