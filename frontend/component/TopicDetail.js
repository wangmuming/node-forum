import React from 'react';
import 'highlight.js/styles/github-gist.css';
import {getTopicDetail} from '../lib/client';
import {renderMarkdown} from '../lib/utils';
import { Router, Route, Link, browserHistory } from 'react-router';

export default class TopicDetail extends React.Component{

  constructor(pros){
    super(pros);
    this.state = {};
  }

  componentDidMount(){
    getTopicDetail(this.props.params.id)
      .then(topic => {
        topic.html = renderMarkdown(topic.content);
        this.setState({topic});
      })
      .catch(err => console.error(err));
  }

  render(){
    const topic = this.state.topic;
    if(!topic){
      return(
        <div>正在加载...</div>
      );
    }
    return(
      <div>
        <h2>{topic.title}</h2>
        <Link to={`/topic/${topic._id}/edit`} className="btn btn-primary">编辑</Link>
        <hr />
        <p>标签：
          {topic.tags.map((tag, i) => {
            return(
              <span className="label label-primary" style={{marginRight: 10}} key={i}>{tag}</span>
            );
          })}
        </p>
        <section dangerouslySetInnerHTML={{__html: topic.html}}></section>
        <ul className="list-group">
          {topic.comments.map((item, i) => {
            return(
              <li className="list-group-item" key={i}>
                {item.authorId}于{item.createdAt}说：<br/>{item.content}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
