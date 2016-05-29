window.jQuery = require('jquery');
require('bootstrap-webpack');

// import 'bootstrap-webpack';
import { Router, Route, Link, browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import TopicDetail from './component/TopicDetail';
import Login from './component/Login';
import ResetPassword from './component/ResetPassword';
import Signup from './component/Signup';
import NewTopic from './component/NewTopic';
import EditTopic from './component/EditTopic';
import Profile from './component/Profile';
import Notification from './component/Notification';

const e = document.createElement('div');
e.id = 'app';
document.body.appendChild(e);

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/topic/:id" component={TopicDetail}/>
      <Route path="/topic/:id/edit" component={EditTopic}/>
      <Route path="new" component={NewTopic}/>
      <Route path="/login" component={Login}/>
      <Route path="/reset_password" component={ResetPassword}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/notification" component={Notification}/>
    </Route>
  </Router>
), e);
