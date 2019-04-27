import React from 'react';
import { Button } from 'rebass';

const IconButton = props => {
  return (
    <Button
      as="div"
      bg="transparent"
      color="gray"
      onClick={props.onClick}
      px={0}
      py={0}
    >
      {props.icon}
    </Button>
  );
};

export default IconButton;
