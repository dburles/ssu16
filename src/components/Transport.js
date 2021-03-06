import React from 'react';
import Bell from 'react-feather/dist/icons/bell';
import BellOff from 'react-feather/dist/icons/bell-off';
import Circle from 'react-feather/dist/icons/circle';
import Cpu from 'react-feather/dist/icons/cpu';
import HelpCircle from 'react-feather/dist/icons/help-circle';
import Mic from 'react-feather/dist/icons/mic';
import Play from 'react-feather/dist/icons/play';
import Stop from 'react-feather/dist/icons/square';
import { Button, Flex, Box, Text } from 'rebass';
import styled, { css } from 'styled-components';
import { themeGet, space, color } from 'styled-system';
import Container from './Container';
import Input from './Input';
import Space from './Space';
import TransportSection from './TransportSection';

const Divider = styled.div`
  ${space}
  ${color}
  height: 38px;
`;

Divider.defaultProps = {
  p: '1px',
  mx: 3,
  bg: 'gray2',
};

const PatternText = styled.span`
  color: ${themeGet('colors.base')};
`;

const Mode = styled(Text)`
  display: inline-block;
  cursor: pointer;
  margin-top: 4px;
  ${props =>
    props.active &&
    css`
      border-bottom: 4px solid ${themeGet('colors.red')};
    `}
`;

const Transport = props => {
  return (
    <Container py={2} px={3} alignItems="center">
      <Text color="silver" fontWeight="bold" fontSize={4} width="3em">
        <PatternText>P</PatternText>
        {String(props.pattern + 1).padStart(2, '0')}
      </Text>
      <TransportSection title="Mode">
        <Flex>
          {/* TODO, not really needed with keyboard
            <Box>
            <Mode
              fontWeight="bold"
              color="silver"
              onClick={() => props.onChangeMode('prf')}
              active={props.mode === 'prf'}
            >
              PRF
            </Mode>
          </Box>
          <Space mx={2} /> */}
          <Box>
            <Mode
              fontWeight="bold"
              color="silver"
              onClick={() => props.onChangeMode('seq')}
              active={props.mode === 'seq'}
            >
              SEQ
            </Mode>
          </Box>
          <Space mx={2} />
          <Box>
            <Mode
              fontWeight="bold"
              color="silver"
              onClick={() => props.onChangeMode('pat')}
              active={props.mode === 'pat'}
            >
              PAT
            </Mode>
          </Box>
        </Flex>
      </TransportSection>
      <Divider />
      <TransportSection>
        <Button
          as="div"
          bg={props.playing ? 'green' : 'gray'}
          py={1}
          px={2}
          onClick={props.onTogglePlay}
        >
          <Play />
        </Button>
      </TransportSection>
      <Space mx={1} />
      <TransportSection>
        <Button
          as="div"
          bg={props.recordingPrf ? 'red' : 'gray2'}
          py={1}
          px={2}
          onClick={props.onTogglePerformanceRecord}
        >
          <Circle />
        </Button>
      </TransportSection>
      <Space mx={1} />
      <TransportSection>
        <Button
          as="div"
          bg={props.metronome ? 'base' : 'gray2'}
          py={1}
          px={2}
          onClick={props.onToggleMetronome}
        >
          {props.metronome ? <Bell /> : <BellOff />}
        </Button>
      </TransportSection>
      <Space mx={1} />
      <TransportSection>
        <Button
          as="div"
          bg={props.latencyHint === 'fastest' ? 'purple' : 'gray2'}
          py={1}
          px={2}
          onClick={props.onToggleLatencyHint}
        >
          <Cpu />
        </Button>
      </TransportSection>
      <Divider />
      <TransportSection>
        <Button
          as="div"
          bg={props.recordingAudio ? 'red' : 'gray2'}
          py={1}
          px={2}
          {...(props.recordAudioWhileHeld
            ? {
                onMouseDown: props.onToggleAudioRecord,
                onMouseUp: props.onToggleAudioRecord,
              }
            : {
                onClick: props.onToggleAudioRecord,
              })}
        >
          {props.recordingAudio ? <Stop /> : <Mic />}
        </Button>
      </TransportSection>
      <Space mx={1} />
      <TransportSection title="Hold?">
        <Input
          type="checkbox"
          checked={props.recordAudioWhileHeld}
          onChange={props.onToggleAudioRecordMode}
        />
      </TransportSection>
      <Divider />
      <TransportSection title="BPM">
        <Flex>
          <Input
            type="number"
            width="4em"
            value={props.bpm}
            onChange={props.onChangeBpm}
          />
          <Space mx={1} />
          <Button
            as="div"
            bg="transparent"
            border="1px solid"
            borderColor="gray"
            fontWeight="normal"
            fontSize="0.7em"
            onClick={props.onTap}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            TAP
          </Button>
        </Flex>
      </TransportSection>
      <Divider />
      <TransportSection title="Swing">
        <Input
          type="number"
          width="4em"
          min="0"
          max="100"
          value={props.swing}
          onChange={props.onChangeSwing}
        />
      </TransportSection>
      <Divider />
      <TransportSection>
        <Button
          as="div"
          bg={props.help ? 'base' : 'gray2'}
          py={1}
          px={2}
          onClick={props.onToggleHelp}
        >
          <HelpCircle />
        </Button>
      </TransportSection>
    </Container>
  );
};

Transport.defaultProps = {
  mode: 'prf',
  pattern: 0,
  bpm: 120,
  swing: 0,
};

export default Transport;
