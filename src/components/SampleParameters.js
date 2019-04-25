import React from 'react';
import Lock from 'react-feather/dist/icons/lock';
import Unlock from 'react-feather/dist/icons/unlock';
import { Button, Box } from 'rebass';
import Container from './Container';
import Input from './Input';
import Title from './Title';

const Control = props => {
  return <Box p={3}>{props.children}</Box>;
};

const SampleParameters = props => {
  return (
    <Container flexDirection="column">
      <Control>
        <Button
          onClick={props.onToggleSampleLock}
          bg={props.locked ? 'base' : 'gray'}
          py={1}
          px={2}
        >
          {props.locked ? <Lock /> : <Unlock />}
        </Button>
      </Control>
      <Control>
        <Title>Volume</Title>
        <Input
          type="range"
          min={0}
          max={100}
          value={props.volume}
          onChange={props.onChangeVolume}
          width={1}
        />
      </Control>
      <Control>
        <Title>Pitch</Title>
        <Input type="number" min={0} max={100} width={1} />
      </Control>
      <Control>
        <Title>Start</Title>
        <Input
          type="number"
          min={0}
          value={props.startPoint}
          onChange={props.onChangeStartPoint}
          width={1}
        />
      </Control>
      <Control>
        <Title>End</Title>
        <Input type="number" min={0} width={1} />
      </Control>
      <Control>
        <Title>Offset</Title>
        <Input
          type="range"
          min={0}
          max={100}
          value={props.offset}
          onChange={props.onChangeOffset}
          width={1}
        />
      </Control>
      <Control>
        <Button
          bg="transparent"
          border="1px solid"
          fontSize="11px"
          color="gray"
        >
          Delete
        </Button>
      </Control>
    </Container>
  );
};

export default SampleParameters;
