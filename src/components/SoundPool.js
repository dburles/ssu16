import React, { useRef } from 'react';
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
  const filesRef = useRef();
  return (
    <Container flexDirection="column" py={3}>
      <input
        ref={filesRef}
        id="addFiles"
        type="file"
        multiple
        hidden
        onChange={props.onAddSamples}
        accept="audio/*"
      />
      <Flex
        style={{ cursor: 'pointer' }}
        justifyContent="center"
        alignItems="center"
        onClick={() => filesRef.current.click()}
      >
        <StyledPlus />
        <Title>Add Samples</Title>
      </Flex>
      <Space py={2} />
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
