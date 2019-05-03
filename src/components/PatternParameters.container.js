import React from 'react';
import { connect } from 'react-redux';
import PatternParameters from './PatternParameters';

const PatternParametersContainer = ({ copyingPattern, dispatch }) => {
  return (
    <PatternParameters
      copying={copyingPattern}
      toggleCopy={() => {
        dispatch({ type: 'copy-pattern-toggle' });
      }}
    />
  );
};

export default connect(({ copyingPattern }) => ({ copyingPattern }))(
  PatternParametersContainer,
);
