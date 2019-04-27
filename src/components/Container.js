import { Flex } from 'rebass';
import styled from 'styled-components';
import { borders } from 'styled-system';

const Container = styled(Flex)`
  background: rgba(0, 0, 0, 0.3);
  ${borders}
`;

Container.defaultProps = {
  m: 1,
  borderRadius: 6,
};

export default Container;
