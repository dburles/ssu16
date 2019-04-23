import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersContainer = ({ state, dispatch }) => {
  return (
    <SampleParameters
      volume={state.samples[state.activeSampleId].volume}
      onChangeVolume={event => {
        dispatch({ type: 'sample-volume', volume: event.target.value });
      }}
    />
  );
};

export default SampleParametersContainer;
