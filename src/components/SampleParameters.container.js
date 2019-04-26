import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersContainer = ({ state, dispatch }) => {
  const { volume, start, locked, offset } = state.samples.find(
    sound => sound.id === state.activeSampleId,
  );
  return (
    <SampleParameters
      volume={volume}
      offset={offset}
      onChangeOffset={event => {
        dispatch({ type: 'sample-offset', offset: event.target.value });
      }}
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
      locked={locked}
      onDelete={() => {
        if (confirm('Are you sure?')) {
          dispatch({ type: 'delete-active-sound' });
        }
      }}
    />
  );
};

export default SampleParametersContainer;
