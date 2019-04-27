import React from 'react';
import Title from './Title';

const Header = props => {
  return (
    <Title p={3} color="silver">
      {props.children}
    </Title>
  );
};

export default Header;