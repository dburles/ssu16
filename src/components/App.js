import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Flex, Box } from 'rebass';
import Tone from 'tone';
import bpmTap from '../lib/bpm';
import { loadInitialSamples, start, stop } from '../lib/main';
import { mutableState } from '../lib/state';
import ContextParameters from './ContextParameters.container';
import Help from './Help';
import Pads from './Pads.container';
import SampleParameters from './SampleParameters.container';
import SoundPool from './SoundPool.container';
import Transport from './Transport.container';

const App = ({
  activePattern,
  bpm,
  dispatch,
  help,
  latencyHint,
  metronome,
  patternChain,
  patternChainPlaybackPos,
  patterns,
  playing,
  samples,
  swing,
}) => {
  const initialMountRef = useRef(true);

  const hasSamples = samples.length > 0;

  useEffect(() => {
    loadInitialSamples();
  }, []);

  useEffect(() => {
    if (!initialMountRef.current && hasSamples) {
      if (playing) {
        start();
      } else {
        stop();
      }
    }

    initialMountRef.current = false;
  }, [hasSamples, playing]);

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = latencyHint;
  }, [latencyHint]);

  useEffect(() => {
    Tone.Transport.swing = swing / 100;
    Tone.Transport.bpm.value = bpm;
    bpmTap.reset();
  }, [bpm, swing]);

  // Sync with mutableState.
  // It's important that they are each self-contained,
  // otherwise re-assigning unchanged values can cause funkyness.
  useEffect(() => {
    mutableState.patterns = patterns;
  }, [patterns]);
  useEffect(() => {
    mutableState.patternChain = patternChain;
  }, [patternChain]);
  useEffect(() => {
    mutableState.metronome = metronome;
  }, [metronome]);
  useEffect(() => {
    mutableState.patternChainPlaybackPos = patternChainPlaybackPos;
  }, [patternChainPlaybackPos]);
  useEffect(() => {
    mutableState.activePattern = activePattern;
  }, [activePattern]);

  return (
    <Flex m={1} justifyContent="center">
      <Flex flexDirection="column">
        <Box>
          <Transport
            togglePlay={() => {
              dispatch({ type: 'play-toggle' });
            }}
          />
        </Box>

        <Flex style={{ height: '550px' }}>
          <SoundPool />

          <SampleParameters disabled={!hasSamples} />

          <Pads
            onLiveRecord={() => {
              mutableState.liveRecordTime = mutableState.currentTick;
            }}
          />
          <ContextParameters />
        </Flex>

        {help && <Help />}
      </Flex>
    </Flex>
  );
};

export default connect(
  ({
    activePattern,
    bpm,
    dispatch,
    help,
    latencyHint,
    metronome,
    patternChain,
    patternChainPlaybackPos,
    patterns,
    playing,
    samples,
    swing,
  }) => ({
    activePattern,
    bpm,
    dispatch,
    help,
    latencyHint,
    metronome,
    patternChain,
    patternChainPlaybackPos,
    patterns,
    playing,
    samples,
    swing,
  }),
)(App);
