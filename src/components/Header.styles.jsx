import React from 'react';
import propTypes from 'prop-types';

// create header style applying in most of the pages
export const Header = ({ title }) => {
  return (
    <h1
      style={{
        fontSize: '50px',
        textAlign: 'center'
      }}
    >
      {title}
    </h1>
  );
}

Header.propTypes = {
  title: propTypes.func
};
