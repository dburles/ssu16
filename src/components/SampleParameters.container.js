import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersContainer = ({ state, dispatch }) => {
  const { volume, start, locked } = state.samples[state.activeSampleId];
  return (
    <SampleParameters
      volume={volume}
      onChangeVolume={event => {
        dispatch({ type: 'sample-volume', volume: event.target.value });
      }}
      onChangeStartPoint={event => {
        dispatch({ type: 'sample-start-point', position: event.target.value });
      }}
      startPoint={start}
      onToggleSampleLock={() => {
        dispatch({ type: 'lock-sample-toggle' });
      }}
      locked={locked.includes(state.activePattern)}
    />
  );
};

export default SampleParametersContainer;
