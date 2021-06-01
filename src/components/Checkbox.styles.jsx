import React from 'react';
import propTypes from 'prop-types';

// check the checkbox in both create new question and edit question pages
export const Checkbox = ({ type, change, defaultChecked }) => {
  return (
    <input
      type={type}
      onChange={ change }
      defaultChecked={defaultChecked}
    >
    </input>
  );
}

Checkbox.propTypes = {
  type: propTypes.func,
  change: propTypes.func,
  defaultChecked: propTypes.func
};
