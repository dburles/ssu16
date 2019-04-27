import React, { useRef } from 'react';
import Lock from 'react-feather/dist/icons/lock';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Unlock from 'react-feather/dist/icons/unlock';
import { Button, Box } from 'rebass';
import styled from 'styled-components';
import Container from './Container';
import IconButton from './IconButton';
import Input from './Input';
import Title from './Title';

const Control = props => {
  return (
    <Box p={3} {...props}>
      {props.children}
    </Box>
  );
};

const Range = styled.input`
  width: 100%;
`;

const SampleParameters = props => {
  const volumeRef = useRef();
  const offsetRef = useRef();

  return (
    <Container flexDirection="column">
      <Control>
        <Button
          as="div"
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
        <Range
          ref={volumeRef}
          type="range"
          min={0}
          max={100}
          value={props.volume}
          onChange={props.onChangeVolume}
          width={1}
          onMouseUp={() => volumeRef.current.blur()}
        />
      </Control>
      <Control>
        <Title>Offset</Title>
        <Range
          ref={offsetRef}
          type="range"
          min={0}
          max={100}
          value={props.offset}
          onChange={props.onChangeOffset}
          width={1}
          onMouseUp={() => offsetRef.current.blur()}
        />
      </Control>
      <Control flex={1}>
        <Title>Start</Title>
        <Input
          type="number"
          min={0}
          value={props.startPoint}
          onChange={props.onChangeStartPoint}
          width={1}
        />
      </Control>
      {/* TODO <Control>
        <Title>Length</Title>
        <Input type="range" min={0} max={15} width={1} />
      </Control> */}
      <Control>
        <IconButton onClick={props.onDelete} icon={<Trash2 />} />
      </Control>
    </Container>
  );
};

export default SampleParameters;
