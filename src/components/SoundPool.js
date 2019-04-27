import React, { useRef } from 'react';
import Plus from 'react-feather/dist/icons/plus';
import Trash2 from 'react-feather/dist/icons/trash-2';
import Volume2 from 'react-feather/dist/icons/volume-2';
import VolumeX from 'react-feather/dist/icons/volume-x';
import { Flex, Text, Box } from 'rebass';
import styled from 'styled-components';
import { themeGet } from 'styled-system';
import Container from './Container';
import IconButton from './IconButton';
import Space from './Space';
import Title from './Title';

const StyledPlus = styled(Plus)`
  color: ${themeGet('colors.base')};
`;

const SoundsContainer = styled(Box)`
  overflow-y: auto;
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
        px={4}
      >
        <StyledPlus />
        <Title>Add Samples</Title>
      </Flex>

      <Space py={2} />

      <SoundsContainer flex={1}>
        {props.samples.map(sample => (
          <Text
            flex={1}
            style={{ cursor: 'pointer' }}
            fontSize="13px"
            py={1}
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
      </SoundsContainer>

      <Flex px={3} pt={3}>
        <Box flex={1}>
          <IconButton onClick={props.onDelete} icon={<Trash2 />} />
        </Box>
        <Box>
          <IconButton
            onClick={props.onMute}
            icon={props.muted ? <VolumeX /> : <Volume2 />}
          />
        </Box>
      </Flex>
    </Container>
  );
};

export default SoundPool;
