import React from 'react';
import { connect } from 'react-redux';
import PatternParameters from './PatternParameters.container';

const ContextParametersContainer = ({ mode }) => {
  const componentMap = {
    prf: null,
    seq: null,
    pat: <PatternParameters />,
  };

  return componentMap[mode];
};

export default connect(({ mode }) => ({ mode }))(ContextParametersContainer);
