import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Range = styled.input`
  width: 100%;
  outline: none;
`;

const Knob = props => {
  const ref = useRef();
  useEffect(() => {
    const handleChange = event => props.onChange(event);
    const element = ref.current;
    element.addEventListener('change', handleChange);
    return () => element.removeEventListener('change', handleChange);
  }, [props, ref]);
  return (
    <Range
      ref={ref}
      type="range"
      width={1}
      className="input-knob"
      data-bgcolor="#555555"
      data-fgcolor="#CCCCCC"
      data-diameter="30"
      {...props}
    />
  );
};

export default Knob;
