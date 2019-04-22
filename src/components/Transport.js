import React from 'react';
import Play from 'react-feather/dist/icons/play';
import Stop from 'react-feather/dist/icons/square';
import { Button, Flex, Box, Text } from 'rebass';
import styled from 'styled-components';
import { themeGet, space, color } from 'styled-system';
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
  color: ${themeGet('colors.olive')};
`;

const Transport = props => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Text color="silver" fontWeight="bold" fontSize={4}>
        <PatternText>P</PatternText>
        {String(props.pattern + 1).padStart(2, '0')}
      </Text>
      <Divider />
      <TransportSection title="Mode">
        <Flex>
          <Box>
            <Text color="silver">
              <input
                id="prf"
                type="radio"
                checked={props.mode === 'prf'}
                onChange={props.onChangeMode}
              />{' '}
              <label htmlFor="prf">PRF</label>
            </Text>
          </Box>
          <Space mx={2} />
          <Box>
            <Text color="silver">
              <input
                id="seq"
                type="radio"
                checked={props.mode === 'seq'}
                onChange={props.onChangeMode}
              />{' '}
              <label htmlFor="seq">SEQ</label>
            </Text>
          </Box>
          <Space mx={2} />
          <Box>
            <Text color="silver">
              <input
                id="pat"
                type="radio"
                checked={props.mode === 'pat'}
                onChange={props.onChangeMode}
              />{' '}
              <label htmlFor="pat">PAT</label>
            </Text>
          </Box>
        </Flex>
      </TransportSection>
      <Divider />
      <TransportSection title="BPM">
        <Flex>
          <Input
            name="bpm"
            type="number"
            width="4em"
            value={props.bpm}
            onChange={props.onChange}
          />
          <Space mx={1} />
          <Button
            bg="darkGray"
            border="1px solid"
            borderColor="gray"
            fontWeight="normal"
            fontSize={1}
            onClick={props.onTap}
          >
            TAP
          </Button>
        </Flex>
      </TransportSection>
      <Divider />
      <TransportSection title="Swing">
        {' '}
        <Input
          name="swing"
          type="number"
          width="3em"
          value={props.swing}
          onChange={props.onChange}
        />
      </TransportSection>
      <Divider />
      <TransportSection>
        <Button bg="olive" py={1} px={2} onClick={props.onTogglePlay}>
          {props.playing ? <Stop /> : <Play />}
        </Button>
      </TransportSection>
    </Flex>
  );
};

Transport.defaultProps = {
  mode: 'prf',
  pattern: 0,
  bpm: 120,
  swing: 0,
};

export default Transport;
