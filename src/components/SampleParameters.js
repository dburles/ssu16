import React from 'react';
import Lock from 'react-feather/dist/icons/lock';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Unlock from 'react-feather/dist/icons/unlock';
import { Button, Box } from 'rebass';
import styled from 'styled-components';
import Container from './Container';
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
  -webkit-appearance: none;
  width: 100%;
  margin: 5.9px 0;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10.2px;
    cursor: pointer;
    background: #484d4d;
    border-radius: 0px;
    border: 0px solid #010101;
  }
  &::-webkit-slider-thumb {
    border: 0px solid #ff1e00;
    height: 22px;
    width: 13px;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5.9px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #545a5a;
  }
  &::-moz-range-track {
    width: 100%;
    height: 10.2px;
    cursor: pointer;
    background: #484d4d;
    border-radius: 0px;
    border: 0px solid #010101;
  }
  &::-moz-range-thumb {
    border: 0px solid #ff1e00;
    height: 22px;
    width: 13px;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
  }
  &::-ms-track {
    width: 100%;
    height: 10.2px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: #3c4040;
    border: 0px solid #010101;
    border-radius: 0px;
  }
  &::-ms-fill-upper {
    background: #484d4d;
    border: 0px solid #010101;
    border-radius: 0px;
  }
  &::-ms-thumb {
    border: 0px solid #ff1e00;
    height: 22px;
    width: 13px;
    border-radius: 0px;
    background: #ffffff;
    cursor: pointer;
    height: 10.2px;
  }
  &:focus::-ms-fill-lower {
    background: #484d4d;
  }
  &:focus::-ms-fill-upper {
    background: #545a5a;
  }
`;

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
        <Range
          type="range"
          min={0}
          max={100}
          value={props.volume}
          onChange={props.onChangeVolume}
          width={1}
        />
      </Control>
      <Control>
        <Title>Offset</Title>
        <Range
          type="range"
          min={0}
          max={100}
          value={props.offset}
          onChange={props.onChangeOffset}
          width={1}
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
        <Button
          bg="transparent"
          border="1px solid"
          color="gray"
          onClick={props.onDelete}
          py={1}
          px={2}
        >
          <Trash2 />
        </Button>
      </Control>
    </Container>
  );
};

export default SampleParameters;
