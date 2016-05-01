import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import {getTopicList} from '../lib/client';

export default class TopicList extends React.Component {

  constructor(pros){
    super(pros);
    this.state = {};
  }

  componentDidMount() {
    getTopicList({})
      .then(ret => this.setState({list: ret.list}))
      .catch(err => console.log(err));
  }

  render() {
    const list = Array.isArray(this.state.list) ? this.state.list : [];
    return (
      <ul className="list-group">
        {list.map((item, i) => {
          return (
            <Link to={`/topic/${item._id}`} className="list-group-item" key={i}>{item.title}</Link>
          );
        })}
      </ul>
    );
  }
}
