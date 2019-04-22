import React from 'react';
import Plus from 'react-feather/dist/icons/plus';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import { themeGet } from 'styled-system';
import Title from './Title';

const StyledPlus = styled(Plus)`
  color: ${themeGet('colors.olive')};
`;

const SoundPool = props => {
  return (
    <Flex flexDirection="column">
      <Flex
        justifyContent="center"
        alignItems="center"
        onClick={props.onAddSamples}
      >
        <StyledPlus />
        <Title>Add Samples</Title>
      </Flex>
      {props.samples.map(sample => (
        <Text
          p={2}
          color="silver"
          key={sample.id}
          onClick={() => props.onSoundClick(sample.id)}
          {...(props.selectedSampleId === sample.id
            ? { bg: 'olive', color: 'white' }
            : {})}
        >
          {sample.name}
        </Text>
      ))}
    </Flex>
  );
};

export default SoundPool;
