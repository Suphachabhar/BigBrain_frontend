import React from 'react';
import '../App.css'
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Link
} from 'react-router-dom';
import { Button } from '../components/Button.styles';
import { Quizname } from '../components/Quizname.style';
function GameBoard ({ quiz, changeAlert, forceLogout, setRedirect }) {
  const cookies = new Cookies();
  const [show, setShow] = React.useState(true);
  const [name, setName] = React.useState(quiz.name);
  const [thumbnail, setThumbnail] = React.useState(quiz.thumbnail);
  const [questions, setQuestions] = React.useState(quiz.questions);
  const [nQuestions, setNQuestions] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [session, setSession] = React.useState(quiz.active);
  const [hasSession, setHasSession] = React.useState(quiz.active !== null);
  const [position, setPosition] = React.useState(-1);
  const [oldSessions, setOldSessions] = React.useState([]);
  const [answerAvailable, setAnswerAvailable] = React.useState(false);
  const initialisation = React.useRef(true);
  const [popupArea, setPopup] = React.useState(null);
  const [history, setHistory] = React.useState(null);
  const [prevSession, setPrevSession] = React.useState(null);

  // close button for the popup and alert
  const closeBtn = React.createElement('button', {
    onClick: () => { setPopup(null); }
  }, 'Close');

  // fetch all if the information of the quiz
  const getInfo = () => {
    fetch('http://localhost:5005/admin/quiz/' + quiz.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          setName(result.name);
          setQuestions(result.questions);
          setNQuestions(result.questions.length);
          setThumbnail(result.thumbnail);
          let timeTmp = 0;
          result.questions.forEach((q) => {
            timeTmp += q.time;
          });
          setTime(timeTmp);
          if (!hasSession && result.active) {
            setSession(result.active);
            setHasSession(true);
          } else if (hasSession && !result.active) {
            setPrevSession(session);
            setSession(null);
            setHasSession(false);
          }
          setOldSessions(result.oldSessions);
        });
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  // fetch start session of the quiz
  const startSession = () => {
    fetch('http://localhost:5005/admin/quiz/' + quiz.id + '/start', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        getInfo();
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  // fetch stop question of the quiz
  const stopSession = () => {
    fetch('http://localhost:5005/admin/quiz/' + quiz.id + '/end', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        getInfo();
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  // fetch delete function of the game
  const deleteGame = () => {
    fetch('http://localhost:5005/admin/quiz/' + quiz.id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          changeAlert('success', 'You have deleted "' + name + '"');
          setShow(false);
        });
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  // copy url and send to another player
  const copySession = () => {
    navigator.clipboard.writeText('http://localhost:3000/join/' + session);
  };

  // show the url link
  const showShareLink = () => {
    setPopup(
      <>
        <div
          className='popup'
        >
          <div>
            <p>You have started a session for &quot;{name}&quot;!</p>
            <p>Session ID: {session} <Button title="Copy link" click={copySession} /></p>
          </div>
          {closeBtn}
        </div>
      </>
    );
  };

  // fetch the status of the game
  const updateSessionStatus = () => {
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
          const i = result.results.position;
          const available = result.results.answerAvailable;
          setQuestions(result.results.questions);
          setPosition(i);
          if (i >= result.results.questions.length) {
            setPrevSession(session);
            setSession(null);
            setHasSession(false);
          } else if (i >= 0 && !available) {
            const timeout = result.results.questions[i].time * 1000 - (new Date() - new Date(result.results.isoTimeLastQuestionStarted));
            setTimeout(() => {
              setAnswerAvailable(true);
            }, timeout);
          }
          setAnswerAvailable(available);
        });
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  // fetch the advance session
  const advanceSession = () => {
    fetch('http://localhost:5005/admin/quiz/' + quiz.id + '/advance', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        updateSessionStatus();
        console.log(questions[0]);
      } else if (data.status === 403) {
        forceLogout();
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
    updateSessionStatus();
  };

  // use useEffect from the fetch getting all information
  React.useEffect(() => {
    getInfo(true);
  }, []);

  // use useEffect to see the session of the game
  React.useEffect(() => {
    if (session) {
      updateSessionStatus();
    }
    if (initialisation.current) {
      initialisation.current = false;
    } else if (hasSession) {
      showShareLink();
    } else {
      setPopup(
        <>
          <div
            className='popup'
          >
            <div>
              <p>The session for &quot;{name}&quot; has ended.</p>
              <Link
                to={'/results/' + prevSession}
              >
                <Button title="See results" />
              </Link>
            </div>
            {closeBtn}
          </div>
        </>
      );
    }
  }, [hasSession]);

  React.useEffect(() => {
    if (oldSessions.length > 0) {
      const options = oldSessions.map((s) => {
        return <option key={s} onClick={() => { setRedirect('/results/' + s); }}>{s}</option>;
      });
      setHistory(
        <select>
          <option>View previous session results</option>
          {options}
        </select>
      );
    }
  }, [oldSessions]);

  // show thumbnail
  let img = null;
  if (thumbnail) {
    img = <div><img src={thumbnail} /></div>;
  }

  let buttons = null;
  let statusArea = null;
  if (hasSession) {
    if (position < 0) {
      statusArea = (
        <>
          <div>
            The game is not started.
            <Button title="Start" name="start" click={advanceSession} />
          </div>
        </>
      );
    } else if (!answerAvailable) {
      statusArea = (
        <>
          <div>
            Question {position + 1} is released. You can advance the game after the answer is released.
          </div>
        </>
      );
    } else {
      statusArea = (
        <>
          <div>
            The answer of question {position + 1} is released.
            <button onClick={advanceSession}>Next question</button>
          </div>
        </>
      );
    }
    buttons = (
      <>
        {statusArea}
        <div>
          <Button title="Share link" click={() => { showShareLink() }} />
          <Button title="Stop session" click={stopSession} />
        </div>
      </>
    );
  } else {
    buttons = (
      <>
        <Button title="Create session" id="session" click={startSession} />
        <Link
          to={'/edit/' + quiz.id}
        >
          <Button title="Edit" />
        </Link>
        {history}
        <Button title="Delete" click={deleteGame} />
      </>
    );
  }

  if (show) {
    return (
      <>
        <ul className="list-group">
          <li className="list-group-item">
            <Quizname title={quiz.name} />
            <p>Number of questions: {nQuestions}</p>
            <p>Time: {(time / 60).toFixed(1)} mins</p>
            {img}
            {buttons}
            {popupArea}
          </li>
        </ul>
      </>
    );
  } else {
    return null;
  }
}

GameBoard.propTypes = {
  quiz: propTypes.object,
  changeAlert: propTypes.func,
  forceLogout: propTypes.func,
  setRedirect: propTypes.func
};

export default GameBoard;
