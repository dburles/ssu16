import React from 'react';
import { Flex, Text, Box } from 'rebass';
import styled from 'styled-components';
import Space from './Space';

const Title = styled(Text)`
  text-transform: uppercase;
`;

const TransportSection = props => {
  return (
    <Flex alignItems="center">
      {props.title ? (
        <>
          <Title color="gray2" fontWeight="bold" fontSize={1}>
            {props.title}
          </Title>{' '}
          <Space mx={2} />
        </>
      ) : (
        undefined
      )}

      <Box>{props.children}</Box>
    </Flex>
  );
};

export default TransportSection;
