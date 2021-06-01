import React from 'react';
import '../App.css'
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Link,
  Redirect
} from 'react-router-dom';
function Login ({ changeAlert }) {
  const cookies = new Cookies();
  const [redirect, setRedirect] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPassword] = React.useState('');

  // login page, need to create the credential
  const checkCredential = (e) => {
    fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: pw
      })
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          cookies.set('email', email);
          cookies.set('token', result.token);
          changeAlert('success', 'You have logged in.');
          setRedirect('/dashboard');
        });
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  if (redirect === '') {
    return (
      <body className="text-center">
        <div
          className='form-signin'
        >
          <h1 className="h3 mb-3 font-weight-normal">
            Please sign in
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
          <br />
          <button
            className='btn btn-lg btn-primary btn-block btn-sm'
            onClick={checkCredential}
            type="submit"
          >
            Login
          </button>
          <br />
          <Link to="/register">
            {"Don't have an account? Sign Up"}
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

Login.propTypes = {
  changeAlert: propTypes.func
};

export default Login;
