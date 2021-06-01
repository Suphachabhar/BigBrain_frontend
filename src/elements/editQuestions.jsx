import React from 'react';
import { OptionStyle } from '../components/OptionStyle.styles';
import { useParams } from 'react-router';
import Cookies from 'universal-cookie';
import propTypes from 'prop-types';
import {
  Redirect
} from 'react-router-dom';

function EditQuestion ({ changeAlert, forceLogout }) {
  const cookies = new Cookies();
  const { id, qid } = useParams();
  const [redirect, setRedirect] = React.useState('');
  const [updateType, setUpdateType] = React.useState('multiple');
  const [numAnswer, setNumAnswer] = React.useState('1');
  const [game, setGame] = React.useState(null);
  const [question, setQuestion] = React.useState('');
  const [time, setTime] = React.useState(0);
  const [point, setPoint] = React.useState(0);
  const [src, setSrc] = React.useState('');
  const answers = [];
  const setAnswers = [];
  for (let i = 0; i < 6; i++) {
    const [answer, setAnswer] = React.useState('');
    answers.push(answer);
    setAnswers.push(setAnswer);
  }
  const correct = [];
  const setCorrect = [];
  for (let i = 0; i < 6; i++) {
    const [isCorrect, setIsCorrect] = React.useState(false);
    correct.push(isCorrect);
    setCorrect.push(setIsCorrect);
  }

  const [inputs, setInputs] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  // fetch the quiz
  React.useEffect(() => {
    fetch('http://localhost:5005/admin/quiz/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      }
    }).then(data => {
      if (data.status === 200) {
        data.json().then((result) => {
          if (qid < result.questions.length) {
            setGame(result);
            const target = result.questions[qid];
            setQuestion(target.description);
            setTime(target.time);
            setPoint(target.point);
            if (target.src) {
              setSrc(target.src.split('/').pop());
            }
            for (let i = 0; i < target.choices.length; i++) {
              setAnswers[i](target.choices[i].choice);
              setCorrect[i](target.answers.includes(target.choices[i].id));
            }
            setReady(true);
          } else {
            changeAlert('danger', result.error);
            setRedirect('/edit/' + id);
          }
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

  // use useEffect to check the option multiple or single
  React.useEffect(() => {
    if (updateType === 'single') {
      setNumAnswer('0');
    } else {
      setNumAnswer('1');
    }
  }, [updateType]);

  // update value from select the option
  const updateValue = (e) => {
    setUpdateType(e.target.value);
  }

  // changing the question
  const changeQ = () => {
    let valid = true;
    const choicesJSON = [];
    const answersJSON = [];
    if (question === '') {
      valid = false;
      changeAlert('danger', 'You must add a description for the question');
    } else if (time <= 0 || point <= 0) {
      valid = false;
      changeAlert('danger', 'You must add a valid value for time and point (>0)');
    } else {
      let id = 1;
      for (let i = 0; i < 6; i++) {
        if (answers[i] !== '') {
          choicesJSON.push({
            id: id,
            choice: answers[i]
          });
          if (correct[i]) {
            answersJSON.push(id);
          }
          id++;
        }
      }
      if (choicesJSON.length < 2) {
        valid = false;
        changeAlert('danger', 'The question must have 2-6 choices');
      } else if (answersJSON.length < 1) {
        valid = false;
        changeAlert('danger', 'The question must have correct answer');
      } else if (numAnswer === '0' && answersJSON.length > 1) {
        valid = false;
        changeAlert('danger', 'The single-choice question can only have 1 correct answer');
      }
    }

    // check if the quiz is valid
    if (valid) {
      const newQuiz = [];
      const i = parseInt(qid);
      for (let j = 0; j < game.questions.length; j++) {
        if (j === i) {
          newQuiz.push({
            description: question,
            time: time,
            point: point,
            src: src === '' ? null : ('http://www.youtube.com/embed/' + src),
            choices: choicesJSON,
            answers: answersJSON
          });
        } else {
          newQuiz.push(game.questions[j]);
        }
      }

      // fetch this API to edit the quiz
      fetch('http://localhost:5005/admin/quiz/' + id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify({
          questions: newQuiz,
          name: game.name,
          thumbnail: game.thumbnail
        })
      }).then(data => {
        if (data.status === 200) {
          changeAlert('success', 'You have updated a question');
          setRedirect('/edit/' + id);
        } else if (data.status === 403) {
          forceLogout();
          setRedirect('/login');
        } else {
          data.json().then((result) => {
            changeAlert('danger', result.error);
          });
        }
      });
    }
  }

  // use useEffect to detect the answer area
  React.useEffect(() => {
    if (ready) {
      const answerArea = [];
      for (let i = 0; i < 6; i++) {
        answerArea.push(
          <>
            <div className='form-control' key={i}>
              <input
                type='text'
                placeholder='Answer'
                defaultValue={answers[i]}
                onChange={(e) => { setAnswers[i](e.target.value); } }
              ></input>
              <input
                type='checkbox'
                defaultChecked={correct[i]}
                onChange={() => { setCorrect[i](!correct[i]); }}
              ></input>
              <label>Correct answer</label>
            </div>
          </>
        );
      }
      setInputs(
        <>
          <div
          className='form-floating'
          >
            <label
              className="sr-only"
            >
              Questions
            </label>
            <input
              type='text'
              className='form-control'
              placeholder='Questions'
              defaultValue={question}
              onChange={(e) => { setQuestion(e.target.value); }}
            ></input>
            <label
              className="sr-only"
            >
              Time limit (seconds)
            </label>
            <input
              type='number'
              className='form-control'
              placeholder='Time limit (seconds)'
              defaultValue={time}
              onChange={(e) => {
                if (e.target.value === '') {
                  setTime(0);
                } else {
                  setTime(parseInt(e.target.value));
                }
              }}
            ></input>
            <label
              className="sr-only"
            >
              Points
            </label>
            <input
              type='number'
              className='form-control'
              placeholder='Points'
              defaultValue={point}
              onChange={(e) => {
                if (e.target.value === '') {
                  setPoint(0);
                } else {
                  setPoint(parseInt(e.target.value));
                }
              }}
            ></input>
            <label
              className="sr-only"
            >
              URL
            </label>
            <input
              type='text'
              className='form-control'
              placeholder='YouTube ID (optional)'
              defaultValue={src}
              onChange={(e) => { setSrc(e.target.value); }}
            ></input>
          </div>
          <br />
          <label>Answers:</label>
          {answerArea}
        </>
      );
    }
  }, [ready]);

  if (redirect === '') {
    return (
      <body
        className="text-center"
      >
        <div
        >
          <h1
            className="firstsection"
          >
            Edit question
          </h1>
          <br />
          <div
            className='form-floating'
          >
            <label>
              Question:
            </label>
            <label>Type:</label>
            <OptionStyle change={updateValue}/>
          </div>
          {inputs}
          <br />
          <button
            className='btn btn-lg btn-primary btn-block btn-sm'
            onClick={changeQ}
          >
            Change
          </button>
          <br />
        </div>
      </body>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

EditQuestion.propTypes = {
  changeAlert: propTypes.func,
  forceLogout: propTypes.func
};

export default EditQuestion;
