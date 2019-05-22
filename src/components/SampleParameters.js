import React from 'react';
import Lock from 'react-feather/dist/icons/lock';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Unlock from 'react-feather/dist/icons/unlock';
import { Button, Box, Flex } from 'rebass';
import styled from 'styled-components';
import Container from './Container';
import Header from './Header';
import IconButton from './IconButton';
import Knob from './Knob';
import TitleSecondary from './TitleSecondary';

const Control = props => {
  return (
    <Box py={props.py} {...props} style={{ textAlign: 'center' }}>
      {props.children}
    </Box>
  );
};

Control.defaultProps = {
  py: 2,
  width: 1 / 2,
};

const SampleParametersContainer = styled(Container)`
  width: 150px;
`;

const SampleParameters = props => {
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

      <Flex flexWrap="wrap" alignItems="center" my={4}>
        <Control>
          <TitleSecondary>Volume</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={100}
            value={props.volume}
            onChange={props.onChangeVolume}
          />
        </Control>

        <Control>
          <TitleSecondary>Pan</TitleSecondary>
          <Knob
            list="tickmarks"
            disabled={props.disabled}
            min={-1}
            max={1}
            step={0.001}
            value={props.pan}
            onChange={props.onChangePan}
          />
          <datalist id="tickmarks">
            <option value="0" />
          </datalist>
        </Control>

        <Control>
          <TitleSecondary>Pitch</TitleSecondary>
          <Knob
            list="tickmarks"
            disabled={props.disabled}
            min={-24}
            max={24}
            step={1}
            value={props.pitch}
            onChange={props.onChangePitch}
          />
          <datalist id="tickmarks">
            <option value="0" />
          </datalist>
        </Control>

        <Control>
          <TitleSecondary>Offset</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={100}
            value={props.offset}
            onChange={props.onChangeOffset}
          />
        </Control>

        <Control>
          <TitleSecondary>Start</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={1}
            step={0.001}
            value={props.startPoint}
            onChange={props.onChangeStartPoint}
          />
        </Control>

        <Control>
          <TitleSecondary>Length</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={16}
            step={1}
            value={props.duration}
            onChange={props.onChangeDuration}
            style={{ direction: 'rtl' }}
          />
        </Control>

        <Control>
          <TitleSecondary>Filter</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={20000}
            step={1}
            value={props.filterFreq}
            onChange={props.onChangeFilterFreq}
          />
        </Control>
        {/*
        <Control>
          <TitleSecondary>Reverb</TitleSecondary>
          <Knob
            disabled={props.disabled}
            min={0}
            max={1}
            step={0.001}
            value={props.reverbWet}
            onChange={props.onChangeReverbWet}
          />
        </Control>
        */}
      </Flex>

      <Box flex={1} />

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
