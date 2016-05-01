window.jQuery = require('jquery');
require('bootstrap-webpack');

// import 'bootstrap-webpack';
import { Router, Route, Link, browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import TopicDetail from './component/TopicDetail';
import Login from './component/Login';
import NewTopic from './component/NewTopic';
import EditTopic from './component/EditTopic';


// console.log('hello. world');
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
    </Route>
  </Router>
), e);