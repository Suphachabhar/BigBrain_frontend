import React from 'react';
import propTypes from 'prop-types';

// create the button style applying on the dashboard page
export const Button = ({ title, click }) => {
  return (
    <button
      style={{
        width: '130px',
        backgroundColor: '#CDCDCD',
        borderRadius: '5px',
        color: 'black'
      }}
      onClick={click}
    >
      {title}
    </button>
  );
}

Button.propTypes = {
  title: propTypes.func,
  click: propTypes.func
};
