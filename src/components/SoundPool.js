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

const SoundPoolContainer = styled(Container)`
  max-height: 700px;
  overflow-y: auto;
`;

const SoundPool = props => {
  const filesRef = useRef();
  return (
    <SoundPoolContainer flexDirection="column" py={3}>
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
          px={4}
          color="silver"
          key={sample.id}
          onClick={() => props.onSoundPress(sample.id)}
          {...(props.activeSampleId === sample.id
            ? { bg: 'maroon', color: 'white' }
            : {})}
        >
          {sample.name}
        </Text>
      ))}
    </SoundPoolContainer>
  );
};

export default SoundPool;
