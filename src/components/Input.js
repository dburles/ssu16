import styled from 'styled-components';
import {
  space,
  width,
  fontSize,
  border,
  borderRadius,
  borderColor,
  color,
} from 'styled-system';

const Input = styled.input`
  ${color}
  ${space}
  ${width}
  ${fontSize}
  ${border}
  ${borderColor}
  ${borderRadius}
  &:not(:focus) {
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  outline: none;
`;

Input.defaultProps = {
  fontSize: 1,
  px: 2,
  py: 2,
  type: 'text',
  border: '2px solid',
  borderColor: 'gray',
  borderRadius: 4,
  bg: '#2222',
  color: 'silver',
};

export default Input;
