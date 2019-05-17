import React from 'react';
import Title from './Title';

const TitleSecondary = props => {
  return (
    <Title
      color="gray"
      fontWeight="regular"
      fontSize="12px"
      mb={1}
      {...props}
    />
  );
};

export default TitleSecondary;
