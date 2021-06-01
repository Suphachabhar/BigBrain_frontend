import React from 'react';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Redirect
} from 'react-router-dom';
import ChromeDinoGame from 'react-chrome-dino';
import { Header } from '../components/Header.styles';
function Play ({ changeAlert }) {
  const cookies = new Cookies();
  const [redirect, setRedirect] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const [finished, setFinished] = React.useState(null);
  const [question, setQuestion] = React.useState('');
  const [point, setPoint] = React.useState(0);
  const [src, setSrc] = React.useState('');
  const [choices, setChoices] = React.useState([]);
  const [multiple, setMultiple] = React.useState(false);
  const [answersSelected, selectAnswer] = React.useState([]);
  const [time, setTime] = React.useState(0);
  const [timer, setTimer] = React.useState(null);
  const [playing, setPlaying] = React.useState(true);
  const [questionResult, setResult] = React.useState(null);

  // play page including when player need to wait when the game start and playing game
  // display when the session end
  const endSession = () => {
    changeAlert('warning', 'Please join a session to play.');
    clearInterval(timer);
    setRedirect('/join');
  };

  // get the questions
  const getQuestion = (started) => {
    fetch('http://localhost:5005/play/' + cookies.get('player') + '/question', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          setQuestion(result.question.description);
          setPoint(result.question.point);
          setSrc(result.question.src);
          setChoices(result.question.choices);
          setMultiple(result.question.multiple);
          const newTime = result.question.time * 1000 - (new Date() - new Date(result.question.isoTimeLastQuestionStarted));
          setTime(newTime);
          setPlaying(newTime > 0);
          if (newTime > 0) {
            selectAnswer([]);
          }
          setStarted(started);
        });
      } else {
        endSession();
      }
    });
  };

  // check the status of the game
  const checkStatus = () => {
    fetch('http://localhost:5005/play/' + cookies.get('player') + '/status', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          if (result.started) {
            getQuestion(result.started);
          }
        });
      } else if (started) {
        clearInterval(timer);
        fetch('http://localhost:5005/play/' + cookies.get('player') + '/results', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(data => {
          if (data.status === 200) {
            data.json().then((result) => {
              const resultPerQ = [];
              for (let i = 0; i < result.length; i++) {
                resultPerQ.push(<p key={i}>Question {i + 1}: {result[i].correct ? 'correct' : 'wrong'}</p>);
              }
              setFinished(resultPerQ);
            });
          } else {
            endSession();
          }
        });
      } else {
        endSession();
      }
    });
  };

  // check the state of the player in the game
  React.useEffect(() => {
    if (cookies.get('player')) {
      if (playing) {
        clearInterval(timer);
        setResult(null);
        setTimer(setTimeout(() => {
          setPlaying(false);
        }, time));
      } else {
        clearTimeout(timer);
        if (started) {
          fetch('http://localhost:5005/play/' + cookies.get('player') + '/answer', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }).then(data => {
            if (data.status === 200) {
              data.json().then((result) => {
                const correctAnswer = [];
                choices.forEach((choice) => {
                  if (result.answerIds.includes(choice.id)) {
                    correctAnswer.push(<p key={choice.id}>{choice.choice}</p>);
                  }
                });

                setResult(
                  <>
                    <div
                      className='popup'
                    >
                      <p>Correct answer:</p>
                      {correctAnswer}
                      <p>Please wait for admin advancing to the next question.</p>
                    </div>
                  </>
                );
              });
            } else {
              endSession();
            }
          });
        }
        setTimer(setInterval(() => {
          checkStatus();
        }, 1000));
      }
    } else {
      endSession();
    }
  }, [started, playing]);

  // display the url
  let display = null;
  if (src.startsWith('http')) {
    display = <iframe src={src}></iframe>;
  } else if (src !== '') {
    display = <img src={src}></img>;
  }

  // display the answers
  const answers = choices.map((choice) => {
    let ansClass = 'list-group-item';
    if (answersSelected.includes(choice.id)) {
      ansClass += ' selectedAnswer';
    }

    let answerClicked = null;
    if (playing) {
      answerClicked = () => {
        const i = answersSelected.indexOf(choice.id);
        if (i > -1) {
          const newAnswers = answersSelected.slice();
          newAnswers.splice(i, 1);
          selectAnswer(newAnswers);
        } else if (multiple) {
          const newAnswers = answersSelected.slice();
          newAnswers.push(choice.id);
          selectAnswer(newAnswers);
        } else {
          selectAnswer([choice.id]);
        }
        console.log(choice.id);
      };
    }
    return (
      <li className={ansClass} key={choice.id} onClick={answerClicked}>
        {choice.choice}
      </li>
    );
  });
  React.useEffect(() => {
    fetch('http://localhost:5005/play/' + cookies.get('player') + '/answer', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        answerIds: answersSelected
      })
    });
  }, [answersSelected]);

  let numberOfAnswers = null;
  if (multiple) {
    numberOfAnswers = '(You can choose more than one answer.)';
  } else {
    numberOfAnswers = '(You can choose one answer only.)';
  }

  if (redirect !== '') {
    return (
      <Redirect push to={redirect} />
    );
  } else if (!started) {
    return (
      <>
        <Header title={'The game has not started yet'}/>
        <p>Please wait for admin to start the game...</p>
        <br />
        <p>WE KNOW THE BEST: You need some entertainment and warm up your eyes before playing the game...</p>
        <p>Guess how many times the dinosaur is blinking? (I know it does not seem like blinking (but it is))</p>
        <br />
        <ChromeDinoGame />
      </>
    );
  } else if (finished) {
    return (
      <>
        <h1>Game over</h1>
        <h2>Your results:</h2>
        {finished}
      </>
    );
  } else {
    return (
      <>
        <div className='firstsection'>
          <h1>{question + ' (' + point + ((point === 1) ? ' point' : ' points') + ')'}</h1>
          {display}
          <ul className='list-group'>
            {answers}
          </ul>
          {numberOfAnswers}
          {questionResult}
        </div>
      </>
    );
  }
}

Play.propTypes = {
  changeAlert: propTypes.func
};

export default Play;
