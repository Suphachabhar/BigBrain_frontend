import React from 'react';
import { useParams } from 'react-router';
import Cookies from 'universal-cookie';
import {
  Redirect,
  Link
} from 'react-router-dom';
import propTypes from 'prop-types';
import { Header } from '../components/Header.styles';

function Edit ({ changeAlert, forceLogout }) {
  const cookies = new Cookies();
  const { id } = useParams();
  const [redirect, setRedirect] = React.useState('');
  const [questions, setQuestions] = React.useState(null);
  const [quiz, setQuiz] = React.useState([]);
  const [name, setName] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState(null);
  const initialisation = React.useRef(true);

  // fetch all the quiz infomation
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
          setQuiz(result.questions);
          setName(result.name);
          setThumbnail(result.thumbnail);
        })
      }
    })
  }, []);

  // check the delete which question user delete
  const deleteQuestion = (i) => {
    const newQuiz = [];
    for (let j = 0; j < quiz.length; j++) {
      if (j !== i) {
        newQuiz.push(quiz[j]);
      }
    }
    fetch('http://localhost:5005/admin/quiz/' + id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.get('token')
      },
      body: JSON.stringify({
        questions: newQuiz,
        name: name,
        thumbnail: thumbnail
      })
    }).then(data => {
      if (data.status === 200) {
        setQuiz(newQuiz);
        data.json().then((result) => {
          changeAlert('success', 'You have deleted "' + name + '"');
        });
      } else if (data.status === 403) {
        forceLogout();
        setRedirect('/login');
      } else {
        data.json().then((result) => {
          changeAlert('danger', result.error);
        });
      }
    });
  };

  React.useEffect(() => {
    if (initialisation.current) {
      initialisation.current = false;
    } else {
      const questionArea = [];
      for (let i = 0; i < quiz.length; i++) {
        const question = quiz[i];
        questionArea.push(
          <>
            <ul
              className="list-group"
              key={i}
            >
              <li
                className="list-group-item"
              >
                <p>{question.description}</p>
                <br />
                <Link
                  to={'/edit/' + id + '/' + i}
                >
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteQuestion(i)}>Delete</button>
              </li>
            </ul>
          </>
        );
      }
      setQuestions(questionArea);
    }
  }, [quiz, name, thumbnail]);

  if (redirect === '') {
    return (
      <>
      <div className="firstsection">
        <Header title="Question board"/>
        <Link
          to={'/createquestion/' + id}
        >
          <button
          className='btn btn-primary'
          >
            Create a new question
          </button>
        </Link>
      </div>
      <div>{questions}</div>
      </>
    );
  } else {
    return (
      <Redirect push to={redirect} />
    );
  }
}

Edit.propTypes = {
  changeAlert: propTypes.func,
  forceLogout: propTypes.func
};

export default Edit;
