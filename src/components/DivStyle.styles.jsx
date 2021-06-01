import React from 'react';
import propTypes from 'prop-types';

// create the div applying in the dashboard
export const DivStyle = ({ className }) => {
  return (
    <div
    className={className}
    >
    </div>
  );
}

DivStyle.propTypes = {
  className: propTypes.func
};
