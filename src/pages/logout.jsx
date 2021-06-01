import React from 'react';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Redirect
} from 'react-router-dom';

function Logout ({ changeAlert }) {
  const cookies = new Cookies();

  // logout function - linked to this API when click logout
  React.useEffect(() => {
    fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: cookies.get('token')
      }
    }).then(data => {
      cookies.remove('email');
      cookies.remove('token');
      changeAlert('success', 'You have logged out.');
    });
  }, []);

  return <Redirect push to='/login' />
}

Logout.propTypes = {
  changeAlert: propTypes.func
};

export default Logout;
