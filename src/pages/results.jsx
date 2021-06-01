import React from 'react';
import Table from 'react-bootstrap/Table';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Redirect,
  useParams
} from 'react-router-dom';

function Result ({ changeAlert, forceLogout }) {
  const cookies = new Cookies();
  const { session } = useParams();
  const [redirect, setRedirect] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const [ranking, setRanking] = React.useState(null);

  // show the result of the game
  React.useEffect(() => {
    fetch('http://localhost:5005/admin/session/' + session + '/status', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          setQuestions(result.results.questions);
        });
      } else if (data.status === 403) {
        forceLogout();
        setRedirect('/login');
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
          setRedirect('/dashboard');
        });
      }
    });
  }, []);

  // use the useEffect to check the length of question and show the result ranking
  React.useEffect(() => {
    if (questions.length > 0) {
      fetch('http://localhost:5005/admin/session/' + session + '/results', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.get('token')
        }
      }).then(data => {
        if (data.status === 200) {
          data.json().then((result) => {
            const newRanking = [];
            for (let i = 0; i < result.results.length; i++) {
              const player = result.results[i];
              let score = 0;
              let j = 0;
              for (j = 0; j < player.answers.length; j++) {
                const a = player.answers[j];
                if (a.correct) {
                  score += questions[j].point;
                }
              }
              for (j = 0; j < newRanking.length; j++) {
                if (newRanking[j].score < score) {
                  break;
                }
              }
              newRanking.splice(j, 0, {
                name: player.name,
                score: score
              });
            }
            const rankingHTML = [];
            for (let i = 0; i < newRanking.length; i++) {
              const r = newRanking[i];
              rankingHTML.push(
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.score}</td>
                </tr>
              );
            }
            setRanking(rankingHTML);
          });
        } else if (data.status === 403) {
          forceLogout();
          setRedirect('/login');
        } else {
          data.json().then((result) => {
            changeAlert('danger', result.error);
            setRedirect('/dashboard');
          });
        }
      });
    }
  }, [questions])

  if (redirect === '') {
    return (
      <div className="list-group">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {ranking}
          </tbody>
        </Table>
      </div>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Result.propTypes = {
  changeAlert: propTypes.func,
  forceLogout: propTypes.func
};

export default Result;
