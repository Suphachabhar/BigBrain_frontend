import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import Cookies from 'universal-cookie';

import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Create from './pages/create';
import Join from './pages/join';
import Play from './pages/play';
import Logout from './pages/logout';
import Edit from './elements/editGameBoard';
import EditQuestion from './elements/editQuestions';
import CreateQuestion from './elements/createQuestion';
import Result from './pages/results';

function Navigation () {
  return (
    <nav>
      <Link to="/dashboard">
        Dashboard
      </Link>
      <br />
      <Link to="/logout">
        Logout
      </Link>
    </nav>
  );
}
function App () {
  const cookies = new Cookies();

  const [alertArea, setAlert] = React.useState(null);
  const closeBtn = React.createElement('button', {
    className: 'btn-close',
    onClick: () => { setAlert(null); }
  }, 'Close');
  const changeAlert = (type, message) => {
    setAlert(React.createElement('div', {
      className: 'alert alert-' + type + ' alert-dismissible fade show',
      role: 'alert'
    }, message, closeBtn));
  };
  const forceLogout = () => {
    cookies.remove('email');
    cookies.remove('token');
    changeAlert('warning', 'Your session has expired. Please log in again.');
  };

  return (
    <Router>
      <div>
        {alertArea}
      </div>
      <Switch>
        <Route path="/login">
          <Login changeAlert={changeAlert} />
        </Route>
        <Route path="/register">
          <Register changeAlert={changeAlert} />
        </Route>
        <Route path="/dashboard">
          <Navigation />
          <Dashboard
            changeAlert={changeAlert}
            forceLogout={forceLogout}
          />
        </Route>
        <Route path="/create">
          <Navigation />
          <Create
            changeAlert={changeAlert}
            forceLogout={forceLogout}
          />
        </Route>
        <Route path="/createquestion/:id">
          <Navigation />
          <CreateQuestion
            changeAlert={changeAlert}
            forceLogout={forceLogout}
          />
        </Route>
        <Route path="/logout">
          <Logout changeAlert={changeAlert} />
        </Route>
        <Route path="/edit/:id/:qid">
          <Navigation />
          <EditQuestion changeAlert={changeAlert} />
        </Route>
        <Route path="/results/:session">
          <Navigation />
          <Result
            changeAlert={changeAlert}
            forceLogout={forceLogout}
          />
        </Route>
        <Route path="/edit/:id">
          <Navigation />
          <Edit changeAlert={changeAlert} />
        </Route>
        <Route path="/join/:id">
          <Join changeAlert={changeAlert} />
        </Route>
        <Route exact path="/join">
          <Join changeAlert={changeAlert} />
        </Route>
        <Route path="/play">
          <Play changeAlert={changeAlert} />
        </Route>
        <Route exact path="/">
          {cookies.get('token') ? <Redirect to="/login" /> : <Redirect to="/register" />}
        </Route>
        <Route path="/">
          Sorry, I could not find that page
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
