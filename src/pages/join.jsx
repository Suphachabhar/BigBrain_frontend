import React from 'react';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Redirect,
  useParams
} from 'react-router-dom';

function Join ({ changeAlert }) {
  const cookies = new Cookies();
  const { id } = useParams();
  const [redirect, setRedirect] = React.useState('');
  const [session, setSession] = React.useState(id);
  const [name, setName] = React.useState('');

  // page that allow user to join the game
  const joinSession = () => {
    if (name !== '') {
      fetch('http://localhost:5005/play/join/' + session, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name
        })
      }).then(data => {
        if (data.status === 200) {
          data.json().then((result) => {
            cookies.set('player', result.playerId);
            setRedirect('/play');
          });
        } else {
          data.json().then((result) => {
            changeAlert('danger', result.error);
          });
        }
      });
    } else {
      changeAlert('danger', 'Please enter your name.');
    }
  };

  if (redirect === '') {
    return (
      <>
        <div>
          <label className="sr-only">
            Session ID
          </label>
          <input
            type='number'
            placeholder='Session ID'
            onChange={(e) => { setSession(e.target.value); }}
            value={session}
          ></input>
        </div>
        <div>
          <label className="sr-only">
            Your name
          </label>
          <input
            type='text'
            placeholder='Your name'
            onChange={(e) => { setName(e.target.value); }}
          ></input>
        </div>
        <button
          className='btn btn-lg btn-primary btn-block btn-sm'
          onClick={joinSession}
        >
          Join
        </button>
      </>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Join.propTypes = {
  changeAlert: propTypes.func
};

export default Join;
