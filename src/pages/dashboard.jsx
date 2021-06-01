import React from 'react';
import '../App.css'
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Link,
  Redirect
} from 'react-router-dom';

import GameBoard from './../elements/gameBoard';
import { Header } from '../components/Header.styles';
function Dashboard ({ changeAlert, forceLogout }) {
  const cookies = new Cookies();
  const [redirect, setRedirect] = React.useState('');
  const forceLogoutAndRedirect = () => {
    forceLogout();
    setRedirect('/login');
  };

  // create the dashboard page
  const [gameDashboard, setGames] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          setGames(result.quizzes.map((quiz) => {
            return <GameBoard key={quiz.id} quiz={quiz} changeAlert={changeAlert} forceLogout={forceLogoutAndRedirect} setRedirect={setRedirect} />
          }));
        });
      } else {
        forceLogoutAndRedirect();
      }
    });
  }, []);

  if (redirect === '') {
    return (
      <>
        <div className='firstsection'>
          <Header title="Dashboard"/>
          <Link
            to='create'
          >
            <button
            id='newgame'
            className='btn btn-primary'
            >
              Create a new game
            </button>
          </Link>
          <div>
            {gameDashboard}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Dashboard.propTypes = {
  setAlert: propTypes.func,
  forceLogout: propTypes.func
};

export default Dashboard;
