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

const App = ({ state, dispatch }) => {
  const initialMountRef = useRef(true);

  const hasSamples = state.samples.length > 0;

  useEffect(() => {
    loadInitialSamples();
  }, []);

  useEffect(() => {
    if (!initialMountRef.current && hasSamples) {
      if (state.playing) {
        start();
      } else {
        stop();
      }
    }

    initialMountRef.current = false;
  }, [hasSamples, state.playing]);

  useEffect(() => {
    // https://tonejs.github.io/docs/r13/Context#latencyhint
    // Tone.context.latencyHint = state.playing ? 'interactive' : 'fastest';
    Tone.context.latencyHint = 'fastest';
  }, []);

  useEffect(() => {
    Tone.Transport.swing = state.swing / 100;
    Tone.Transport.bpm.value = state.bpm;
    bpmTap.reset();
  }, [state.bpm, state.swing]);

  // Sync with mutableState.
  // It's important that they are each self-contained,
  // otherwise re-assigning unchanged values can cause funkyness.
  useEffect(() => {
    mutableState.patterns = state.patterns;
  }, [state.patterns]);
  useEffect(() => {
    mutableState.patternChain = state.patternChain;
  }, [state.patternChain]);
  useEffect(() => {
    mutableState.metronome = state.metronome;
  }, [state.metronome]);
  useEffect(() => {
    mutableState.patternChainPlaybackPos = state.patternChainPlaybackPos;
  }, [state.patternChainPlaybackPos]);
  useEffect(() => {
    mutableState.activePattern = state.activePattern;
  }, [state.activePattern]);

  return (
    <Flex m={1} justifyContent="center">
      <Flex flexDirection="column">
        <Box>
          <Transport
            state={state}
            dispatch={dispatch}
            togglePlay={() => {
              dispatch({ type: 'play-toggle' });
            }}
          />
        </Box>

        <Flex style={{ height: '550px' }}>
          <SoundPool state={state} dispatch={dispatch} />

          <SampleParameters
            state={state}
            dispatch={dispatch}
            disabled={!hasSamples}
          />

          <Pads
            state={state}
            dispatch={dispatch}
            onLiveRecord={() => {
              mutableState.liveRecordTime = mutableState.currentTick;
            }}
          />
          <ContextParameters state={state} dispatch={dispatch} />
        </Flex>

        {state.help && <Help />}
      </Flex>
    </Flex>
  );
};

export default connect(state => ({ state }))(App);
