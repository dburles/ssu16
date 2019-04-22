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
`;

Input.defaultProps = {
  fontSize: 1,
  px: 2,
  py: 2,
  width: 1,
  type: 'text',
  border: '1px solid',
  borderColor: 'gray',
  borderRadius: 4,
  bg: 'darkGray',
  color: 'silver',
};

export default Input;
