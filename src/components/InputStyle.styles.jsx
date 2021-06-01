import React from 'react';
import propTypes from 'prop-types';

// input style in create new game
export const InputStyle = ({ id, nameInput, type, change, checked }) => {
  return (
    <input
      id={id}
      name={nameInput}
      type={type}
      onChange={ change }
      checked={checked}
    >
    </input>
  );
}

InputStyle.propTypes = {
  id: propTypes.func,
  nameInput: propTypes.func,
  type: propTypes.func,
  change: propTypes.func,
  checked: propTypes.func
};
