import React from 'react';
import PatternParameters from './PatternParameters';

const PatternParametersContainer = ({ dispatch, state }) => {
  return (
    <PatternParameters
      copying={state.copyingPattern}
      toggleCopy={() => {
        dispatch({ type: 'copy-pattern-toggle' });
      }}
    />
  );
};

export default PatternParametersContainer;
