import { Text } from 'rebass';
import styled from 'styled-components';

const Title = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 1;
`;

Title.defaultProps = {
  color: 'base',
  fontWeight: 'bold',
  fontSize: 1,
};

export default Title;
