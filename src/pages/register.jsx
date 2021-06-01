import React from 'react';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Link,
  Redirect
} from 'react-router-dom';

function Register ({ changeAlert }) {
  const cookies = new Cookies();
  const [redirect, setRedirect] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  // register page, need to check credential first
  const checkCredential = (e) => {
    if (email !== '' && pw !== '' && name !== '') {
      fetch('http://localhost:5005/admin/auth/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: pw,
          name: name
        })
      }).then(data => {
        if (data.status === 200) {
          data.json().then((result) => {
            cookies.set('email', email);
            cookies.set('token', result.token);
            changeAlert('success', 'You have registered.');
            setRedirect('/dashboard');
          });
        } else {
          data.json().then((result) => {
            changeAlert('danger', result.error);
          });
        }
      });
    }
  };

  if (redirect === '') {
    return (
      <body className="text-center">
        <div
          className='form-signin'
        >
          <h1 className="h3 mb-3 font-weight-normal">
            Please sign up
          </h1>
          <div
            className='form-floating'
          >
            <label className="sr-only">
              Email
            </label>
              <input
                type='email'
                name='email'
                className='form-control'
                placeholder='Email address'
                onChange={(e) => { setEmail(e.target.value); }}
            ></input>
          </div>
          <div
            className='form-floating'
          >
            <label className="sr-only">
              Password
            </label>
              <input
                type='password'
                name='password'
                className='form-control'
                placeholder='Password'
                onChange={(e) => { setPassword(e.target.value); }}
              ></input>
          </div>
          <div
            className='form-floating'
          >
            <label className="sr-only">
              Name
            </label>
              <input
                type='name'
                name='name'
                className='form-control'
                placeholder='Name'
                onChange={(e) => { setName(e.target.value); }}
              ></input>
          </div>
          <br />
          <button
            className='btn btn-lg btn-primary btn-block btn-sm'
            type='submit'
            onClick={checkCredential}
          >
            Register
          </button>
          <br />
          <Link to="/login">
            {'Already have an account? Login'}
          </Link>
        </div>
      </body>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Register.propTypes = {
  changeAlert: propTypes.func
};

export default Register;
