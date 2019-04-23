import React from 'react';
import PatternParameters from './PatternParameters.container';

const ContextParametersContainer = ({ mode }) => {
  const componentMap = {
    prf: () => null,
    seq: () => null,
    pat: () => <PatternParameters />,
  };

  return React.createElement(componentMap[mode]);
};

export default ContextParametersContainer;
