import React from 'react';
import { Flex, Box } from 'rebass';
import GlobalStyle from './GlobalStyle';
import Pads from './Pads';

const App = props => {
  return (
    <>
      <GlobalStyle />
      <Flex>
        <Box>SoundPool</Box>
        <Flex>
          <Box>
            <Pads />
          </Box>
          <Box>Transport</Box>
        </Flex>
        <Box>SoundContext</Box>
      </Flex>
    </>
  );
};

export default App;
