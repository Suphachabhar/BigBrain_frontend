import React from 'react';
import propTypes from 'prop-types';

// create option component for select component
export const OptionStyle = ({ change }) => {
  return (
    <select
    onChange={ change }
    >
      <option
      value="muliple"
      >
        Multiple choices
      </option>
      <option
      value="single"
      >
        Single choices
    </option>
    </select>
  );
}

OptionStyle.propTypes = {
  change: propTypes.func
};
