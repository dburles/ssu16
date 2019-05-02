import React, { useRef } from 'react';
import Lock from 'react-feather/dist/icons/lock';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Unlock from 'react-feather/dist/icons/unlock';
import { Button, Box, Flex } from 'rebass';
import styled from 'styled-components';
import Container from './Container';
import Header from './Header';
import IconButton from './IconButton';
import Space from './Space';
import TitleSecondary from './TitleSecondary';

const Control = props => {
  return (
    <Box px={3} py={props.py} {...props}>
      {props.children}
    </Box>
  );
};

Control.defaultProps = {
  py: 2,
};

const Range = styled.input`
  width: 100%;
`;

const SampleParametersContainer = styled(Container)`
  transition: opacity 2s ease;
  opacity: ${props => (props.disabled ? '0.5' : '1')};
`;

const SampleParameters = props => {
  const volumeRef = useRef();
  const panRef = useRef();
  const pitchRef = useRef();
  const offsetRef = useRef();
  const startRef = useRef();
  const durationRef = useRef();
  const filterFreqRef = useRef();
  const reverbWetRef = useRef();

  return (
    <SampleParametersContainer
      flexDirection="column"
      disabled={props.disabled}
      py={3}
    >
      <Header>Sound</Header>

      <Flex pt={0} px={3} alignItems="center">
        <TitleSecondary flex={1}>Lock</TitleSecondary>
        <Button
          disabled={props.disabled}
          as="div"
          onClick={props.onToggleSampleLock}
          bg={props.locked ? 'base' : props.disabled ? 'darkGray' : 'gray'}
          color={props.disabled ? 'gray2' : 'white'}
          py={1}
          px={2}
        >
          {props.locked ? <Lock /> : <Unlock />}
        </Button>
      </Flex>

      <Space py={2} />

      <Control>
        <TitleSecondary>Volume</TitleSecondary>
        <Range
          disabled={props.disabled}
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
        <TitleSecondary>Pan</TitleSecondary>
        <Range
          list="tickmarks"
          disabled={props.disabled}
          ref={panRef}
          type="range"
          min={-1}
          max={1}
          step={0.001}
          value={props.pan}
          onChange={props.onChangePan}
          width={1}
          onMouseUp={() => panRef.current.blur()}
        />
        <datalist id="tickmarks">
          <option value="0" />
        </datalist>
      </Control>

      <Control>
        <TitleSecondary>Pitch</TitleSecondary>
        <Range
          list="tickmarks"
          disabled={props.disabled}
          ref={pitchRef}
          type="range"
          min={-24}
          max={24}
          step={1}
          value={props.pitch}
          onChange={props.onChangePitch}
          width={1}
          onMouseUp={() => pitchRef.current.blur()}
        />
        <datalist id="tickmarks">
          <option value="0" />
        </datalist>
      </Control>

      <Space py={2} />

      <Control>
        <TitleSecondary>Offset</TitleSecondary>
        <Range
          disabled={props.disabled}
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

      <Control>
        <TitleSecondary>Start</TitleSecondary>
        <Range
          disabled={props.disabled}
          ref={startRef}
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={props.startPoint}
          onChange={props.onChangeStartPoint}
          width={1}
          onMouseUp={() => startRef.current.blur()}
        />
      </Control>

      <Control>
        <TitleSecondary>Length</TitleSecondary>
        <Range
          disabled={props.disabled}
          ref={durationRef}
          type="range"
          min={0}
          max={16}
          step={1}
          value={props.duration}
          onChange={props.onChangeDuration}
          width={1}
          onMouseUp={() => durationRef.current.blur()}
          style={{ direction: 'rtl' }}
        />
      </Control>

      <Space py={2} />

      <Control>
        <TitleSecondary>Filter Cutoff</TitleSecondary>
        <Range
          disabled={props.disabled}
          ref={filterFreqRef}
          type="range"
          min={0}
          max={20000}
          step={1}
          value={props.filterFreq}
          onChange={props.onChangeFilterFreq}
          width={1}
          onMouseUp={() => filterFreqRef.current.blur()}
        />
      </Control>

      <Control flex={1}>
        <TitleSecondary>Reverb</TitleSecondary>
        <Range
          disabled={props.disabled}
          ref={reverbWetRef}
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={props.reverbWet}
          onChange={props.onChangeReverbWet}
          width={1}
          onMouseUp={() => reverbWetRef.current.blur()}
        />
      </Control>

      <Box px={3}>
        <IconButton
          {...(props.disabled
            ? { disabled: props.disabled }
            : { onClick: props.onDelete })}
          icon={<Trash2 />}
        />
      </Box>
    </SampleParametersContainer>
  );
};

export default SampleParameters;
