import React from 'react';
import 'highlight.js/styles/github-gist.css';
import {getTopicDetail, addComment, deleteComment, deleteTopic} from '../lib/client';
import {renderMarkdown} from '../lib/utils';
import { Router, Route, Link, browserHistory } from 'react-router';
import CommentEditor from './CommentEditor';
import {redirectURL} from '../lib/utils';

export default class TopicDetail extends React.Component{

  constructor(pros){
    super(pros);
    this.state = {};
  }

  componentDidMount(){
    this.refresh();
  }

  // 调取话题接口
  refresh(){
    getTopicDetail(this.props.params.id)
      .then(topic => {
        topic.html = renderMarkdown(topic.content);
        if(topic.comments){
          for(const item of topic.comments){
            item.html = renderMarkdown(item.content);
          }
        }
        this.setState({topic});
      })
      .catch(err => console.error(err));
  }

  // 点击删除评论按钮
  handleDeleteComment(cid){
    if(!confirm('是否删除评论？')) return;
    deleteComment(this.state.topic._id, cid)
      .then(comment => {
        this.refresh();
      })
      .catch(err => {
        alert(err);
      });
  }

  handleDeleteTopic(){
    if(!confirm('是否删除主题？')) return;
    deleteTopic(this.state.topic._id)
      .then(() => {
        redirectURL('/');
      })
      .catch(err => {
        alert(err);
      });
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
        <p>{topic.author.nickname || '佚名'} 发表于 {topic.createdAt}</p>
        <p>
          {!topic.permission.edit ? null :
            <Link to={`/topic/${topic._id}/edit`} className="btn btn-xs btn-primary">
              <i className="glyphicon glyphicon-edit"></i> 编辑
            </Link>
          }
          &nbsp;&nbsp;
          {!topic.permission.delete ? null :
            <button className="btn btn-xs btn-danger" onClick={this.handleDeleteTopic.bind(this)}>
              <i className="glyphicon glyphicon-trash"></i> 删除
            </button>
          }
        </p>
        <hr />
        <p>标签：
          {topic.tags.map((tag, i) => {
            return(
              <span className="label label-primary" style={{marginRight: 10}} key={i}>{tag}</span>
            );
          })}
        </p>
        <section dangerouslySetInnerHTML={{__html: topic.html}}></section>
        <CommentEditor
          title="发表评论"
          onSave={(comment, done) => {
            addComment(this.state.topic._id, comment.content)
              .then(comment => {
                done();
                this.refresh();
              })
              .catch(err => {
                done();
                alert(err);
              });
          }}
        />
        <ul className="list-group">
          {topic.comments.map((item, i) => {
            return(
              <li className="list-group-item" key={i}>
                <span className="pull-right">
                  {!item.permission.delete ? null :
                    <button className="btn btn-xs btn-danger" onClick={this.handleDeleteComment.bind(this, item._id)}>
                      <i className="glyphicon glyphicon-trash"></i>
                    </button>
                  }
                </span>
                {item.author.nickname || '佚名'}于{item.createdAt}说:
                <p dangerouslySetInnerHTML={{__html: item.html}}></p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
