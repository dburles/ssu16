import React from 'react';
import { connect } from 'react-redux';
import PatternParameters from './PatternParameters';

const PatternParametersContainer = ({ chaining, copyingPattern, dispatch }) => {
  return (
    <PatternParameters
      copying={copyingPattern}
      toggleCopy={() => {
        dispatch({ type: 'copy-pattern-toggle' });
      }}
      chaining={chaining}
      toggleChaining={() => {
        dispatch({ type: 'pattern-chaining-toggle' });
      }}
    />
  );
};

export default connect(({ chaining, copyingPattern }) => ({
  chaining,
  copyingPattern,
}))(PatternParametersContainer);
