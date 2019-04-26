import React from 'react';
import { Flex, Box } from 'rebass';
import styled, { css } from 'styled-components';
import { color, space, width, borders, themeGet } from 'styled-system';

const Indicator = styled.div`
  ${color}
  ${width}
  ${space}
  ${borders}

  ${props =>
    props.flashing &&
    css`
      @keyframes flash {
        0% {
          background-color: transparent;
          border: 1px solid ${themeGet('colors.gray')};
        }
        50% {
          background-color: ${themeGet('colors.red')};
          border-color: ${themeGet('colors.red')};
        }
      }
      animation: flash 0.3s step-end infinite;
    `};
`;

const PadBox = styled(Box)`
  ${borders}
  position: relative;
`;

const PadName = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;

  color: ${props =>
    themeGet(props.litPad ? 'colors.grayDark' : 'colors.grayDark')};
`;

const Pad = props => {
  return (
    <Flex flexDirection="column">
      <PadBox
        bg={props.litPad ? 'base' : 'silver'}
        p="3em"
        m={2}
        borderRadius={4}
        onClick={props.onPadPress}
      >
        <PadName litPad={props.litPad}>{props.name}</PadName>
      </PadBox>
      <Flex justifyContent="center">
        <Indicator
          p="4px"
          borderRadius={5}
          border="1px solid"
          flashing={props.flashingIndicator}
          {...(props.litIndicator
            ? {
                bg: 'red',
                borderColor: 'red',
              }
            : {
                borderColor: 'gray',
              })}
        />
      </Flex>
    </Flex>
  );
};

export default Pad;
