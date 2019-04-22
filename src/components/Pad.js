import React from 'react';
import { Flex, Box } from 'rebass';
import styled from 'styled-components';
import { color, space, width, borders } from 'styled-system';

const Indicator = styled.div`
  ${color}
  ${width}
  ${space}
  ${borders}
`;

const PadBox = styled(Box)`
  ${borders}
`;

const Pad = props => {
  return (
    <Flex flexDirection="column">
      <PadBox
        bg={props.litPad ? 'silver' : 'grey'}
        p="3em"
        m={2}
        borderRadius={4}
        onClick={props.onPadPress}
      />
      <Flex justifyContent="center">
        <Indicator
          width={2}
          px={2}
          py={1}
          borderRadius={5}
          border="1px solid"
          {...(props.litIndicator
            ? {
                bg: 'red',
                borderColor: 'red',
              }
            : {
                borderColor: 'grey',
              })}
        />
      </Flex>
    </Flex>
  );
};

export default Pad;
