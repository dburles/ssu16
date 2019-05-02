import React from 'react';
import SampleParameters from './SampleParameters';

const SampleParametersContainer = ({ state, dispatch, disabled }) => {
  const {
    volume,
    start,
    locked,
    offset,
    duration,
    pan,
    filterFreq,
    reverbWet,
    pitch,
  } = state.samples.find(sound => sound.id === state.activeSampleId) || {};

  return (
    <SampleParameters
      disabled={disabled}
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
        if (
          confirm('Are you sure you wish to remove this sound from the pool?')
        ) {
          dispatch({ type: 'delete-active-sound' });
        }
      }}
      duration={duration}
      onChangeDuration={() => {
        dispatch({ type: 'sound-duration', duration: event.target.value });
      }}
      pan={pan}
      onChangePan={() => {
        dispatch({ type: 'sound-pan', pan: event.target.value });
      }}
      filterFreq={filterFreq}
      onChangeFilterFreq={() => {
        dispatch({ type: 'sound-filter-freq', freq: event.target.value });
      }}
      reverbWet={reverbWet}
      onChangeReverbWet={() => {
        dispatch({ type: 'sound-reverb-wet', wet: event.target.value });
      }}
      pitch={pitch}
      onChangePitch={() => {
        dispatch({ type: 'sound-pitch', pitch: event.target.value });
      }}
    />
  );
};

export default SampleParametersContainer;
