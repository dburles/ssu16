import React, { useRef } from 'react';
import Plus from 'react-feather/dist/icons/plus';
import Trash2 from 'react-feather/dist/icons/trash-2';
import { Flex, Text, Box } from 'rebass';
import { Button } from 'rebass';
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
        px={4}
      >
        <StyledPlus />
        <Title>Add Samples</Title>
      </Flex>

      <Space py={2} />

      <Box flex={1}>
        {props.samples.map(sample => (
          <Text
            style={{ cursor: 'pointer' }}
            fontSize="12px"
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
      </Box>

      <Box pl={3} pt={3}>
        <Button
          bg="transparent"
          border="1px solid"
          color="gray"
          onClick={props.onDelete}
          py={1}
          px={2}
        >
          <Trash2 />
        </Button>
      </Box>
    </SoundPoolContainer>
  );
};

export default SoundPool;
