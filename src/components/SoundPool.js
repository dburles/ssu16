import React from 'react';
import Plus from 'react-feather/dist/icons/plus';
import { Flex, Text } from 'rebass';
import styled from 'styled-components';
import { themeGet } from 'styled-system';
import Container from './Container';
import Space from './Space';
import Title from './Title';

const StyledPlus = styled(Plus)`
  color: ${themeGet('colors.base')};
`;

const SoundPool = props => {
  return (
    <Container flexDirection="column" py={3}>
      <Flex
        style={{ cursor: 'pointer' }}
        justifyContent="center"
        alignItems="center"
        onClick={props.onAddSamples}
      >
        <StyledPlus />
        <Title>Add Samples</Title>
      </Flex>
      <Space py={3} />
      {props.samples.map(sample => (
        <Text
          style={{ cursor: 'pointer' }}
          fontSize={1}
          py={2}
          px={5}
          color="silver"
          key={sample.id}
          onClick={() => props.onSoundPress(sample.id)}
          {...(props.activeSampleId === sample.id
            ? { bg: 'base', color: 'white' }
            : {})}
        >
          {sample.name}
        </Text>
      ))}
    </Container>
  );
};

export default SoundPool;
