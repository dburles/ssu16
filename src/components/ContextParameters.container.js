import React from 'react';
import PatternParameters from './PatternParameters.container';

const ContextParametersContainer = ({ state, dispatch }) => {
  const componentMap = {
    prf: () => null,
    seq: () => null,
    pat: () => <PatternParameters state={state} dispatch={dispatch} />,
  };

  return React.createElement(componentMap[state.mode]);
};

export default ContextParametersContainer;
