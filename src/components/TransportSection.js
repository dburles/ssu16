import React from 'react';
import { Flex, Box } from 'rebass';
import Space from './Space';
import Title from './Title';

const TransportSection = props => {
  return (
    <Flex alignItems="center">
      {props.title ? (
        <>
          <Title>{props.title}</Title> <Space mx={2} />
        </>
      ) : (
        undefined
      )}

      <Box>{props.children}</Box>
    </Flex>
  );
};

export default TransportSection;
