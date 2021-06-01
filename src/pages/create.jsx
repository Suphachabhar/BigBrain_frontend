import React from 'react';
import propTypes from 'prop-types';
import Cookies from 'universal-cookie';
import {
  Redirect
} from 'react-router-dom';
import { Header } from '../components/Header.styles';
import { InputStyle } from '../components/InputStyle.styles';

function Create ({ changeAlert, forceLogout }) {
  const cookies = new Cookies();
  const [redirect, setRedirect] = React.useState('');
  const [choice, setChoice] = React.useState(false);
  const [name, setName] = React.useState('');
  const [upload, setUpload] = React.useState(null);

  // create the new game function
  const createGame = () => {
    let valid = true;
    if (choice) {
      if (upload === null) {
        valid = false;
        changeAlert('danger', 'Please choose a file');
      } else if (!upload.name) {
        valid = false;
        changeAlert('danger', 'The file must have \'name\' field');
        console.log(typeof upload);
      } else if (upload.questions) {
        if (!Array.isArray(upload.questions)) {
          valid = false;
          changeAlert('danger', 'The \'questions\' field must be a list of questions');
        } else {
          upload.questions.forEach((q) => {
            if (!q.description || !q.time || !q.point || !q.choices || !q.answers) {
              valid = false;
              changeAlert('danger', 'Each question must have \'description\', \'time\', \'point\', \'choices\' and \'answers\'');
            } else if ((typeof q.time) !== 'number' || (typeof q.point) !== 'number') {
              valid = false;
              changeAlert('danger', 'The \'time\' and \'point\' fields must be a number');
            } else if (!Array.isArray(q.choices) || !Array.isArray(q.answers)) {
              valid = false;
              changeAlert('danger', 'The \'choices\' and \'answers\' fields must be a list');
            } else if (q.choices.length < 2 || q.choices.length > 6) {
              valid = false;
              changeAlert('danger', 'Each question must have 2-6 choices');
            } else {
              const ids = [];
              q.choices.forEach((c) => {
                if (!c.id || !c.choice) {
                  valid = false;
                  changeAlert('danger', 'Each choice must have \'id\' and \'choice\'');
                } else if (c.id) {
                  if (ids.includes(c.id)) {
                    valid = false;
                    changeAlert('danger', 'Each choice in a question must have a unique \'id\'');
                  } else {
                    ids.push(c.id);
                  }
                }
              });
              q.answers.forEach((a) => {
                if (!ids.includes(a)) {
                  valid = false;
                  changeAlert('danger', 'Each answer in a question must be the choice \'id\'');
                }
              });
            }
          });
        }
      }
    } else if (name === '') {
      valid = false;
      changeAlert('danger', 'Please provide a name');
    }

    // if valid, the API will get the new game
    if (valid) {
      fetch('http://localhost:5005/admin/quiz/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.get('token')
        },
        body: JSON.stringify({
          name: choice ? upload.name : name
        })
      }).then(data => {
        if (data.status === 200) {
          if (choice) {
            data.json().then((result) => {
              fetch('http://localhost:5005/admin/quiz/' + result.quizId, {
                method: 'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + cookies.get('token')
                },
                body: JSON.stringify({
                  questions: upload.questions.map((q) => {
                    return {
                      description: q.description,
                      time: q.time,
                      point: q.point,
                      src: q.src ? q.src : null,
                      choices: q.choices.map((c) => {
                        return {
                          id: c.id,
                          choice: c.choice
                        };
                      }),
                      answers: q.answers
                    };
                  }),
                  name: upload.name,
                  thumbnail: upload.thumbnail ? upload.thumbnail : null
                })
              }).then(data => {
                if (data.status === 200) {
                  changeAlert('success', 'You have created "' + name + '"');
                  setRedirect('/dashboard');
                } else if (data.status === 403) {
                  forceLogout();
                  setRedirect('/login');
                } else {
                  data.json().then((result) => {
                    changeAlert('danger', result.error);
                  });
                }
              });
            });
          } else {
            changeAlert('success', 'You have created "' + name + '"');
            setRedirect('/dashboard');
          }
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
  };

  // upload the read
  const readUpload = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsText(e.target.files[0], 'UTF-8');
      reader.onload = (e) => {
        setUpload(JSON.parse(e.target.result));
      };
    } else {
      setUpload(null);
    }
  };

  let input = null;
  if (choice) {
    input = (
      <>
        <div>
          <input
            type='file'
            accept='application/json'
            onChange={readUpload}
          ></input>
        </div>
      </>
    );
  } else {
    input = (
      <>
        <div>
          <label>Name: </label>
          <input
            type='text'
            name='name'
            onChange={(e) => { setName(e.target.value); }}
          ></input>
        </div>
      </>
    );
  }

  if (redirect === '') {
    return (
      <>
        <Header title="Create game"/>
        <div className="firstsection">
          <InputStyle
            id='createGame'
            name='choice'
            type='radio'
            change ={() => { setChoice(false); }}
            checked={!choice} />
          <label
            htmlFor='createGame'
          >Create new game</label>
        </div>
        <div className="firstsection">
          <InputStyle
            id='uploadGame'
            name='choice'
            type='radio'
            change={() => { setChoice(true); }}
            checked={choice} />
          <label
            htmlFor='uploadGame'
          >Upload game data (JSON)</label>
        </div>
        {input}
        <button
          className='btn btn-primary'
          onClick={createGame}
          id="newgame"
        >
          Create
        </button>
      </>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Create.propTypes = {
  changeAlert: propTypes.func,
  forceLogout: propTypes.func
};

export default Create;
