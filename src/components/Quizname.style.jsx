import React from 'react';
import propTypes from 'prop-types';

// create quiz name compnent
export const Quizname = ({ title }) => {
  return (
    <h3
      style={{
        fontSize: '30px',
        textAlign: 'center'
      }}
    >
      {title}
    </h3>
  );
}

Quizname.propTypes = {
  title: propTypes.func
};
