import React from 'react';
import 'highlight.js/styles/github-gist.css';
import {getTopicDetail, loginUser, editTopic} from '../lib/client';
import {renderMarkdown} from '../lib/utils';
import $ from 'jquery';
import {redirectURL} from '../lib/utils';
import underscore from 'underscore';

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
        this.confirmAuth();
      })
      .catch(err => console.error(err));

    // 如何改成全局的？或者用session？
    loginUser()
      .then((user) => {
        this.setState({user});
        this.confirmAuth();
      })
      .catch(err => console.error(err));
  }

  confirmAuth(){
    var auth = {
      auth: 'none',
      read: 'display',
      edit: 'none'
    };
    var user = this.state.user;
    var topic = this.state.topic;
    if(user && user._id && (user._id == (topic && topic.authorId))){
      auth.auth = 'block';
    }
    this.setState({auth});
  }

  // 点击编辑按钮
  handleEdit(e){
    var auth = this.state.auth;
    var topic = this.state.topic;
    auth.read = auth.read == 'none' ? 'block' : 'none';
    auth.edit = auth.edit == 'none' ? 'block' : 'none';
    if(auth.read == 'none'){
      $('#ipt-title').val(topic.title);
      $('#ipt-content').val(topic.content);
      var ts = '';
      underscore.each(topic.tags, (tag) => {
        ts = ts ? `${ts},${tag}` : `${tag}`;
      });
      $('#ipt-tags').val(ts);
    }
    this.setState({auth});
  }


  handleChange(name, e){
    this.state.topic[name] = e.target.value;
  }

  // 点击‘保存’
  handleSubmit(e){
    const $btn = jQuery(e.target);
    $btn.button('loading');
    editTopic(this.state.topic._id, this.state.topic.title, this.state.topic.content, this.state.topic.tags)
      .then(ret => {
        $btn.button('reset');
        console.log(ret);
        redirectURL(`/topic/${ret._id}`);
      })
      .catch(err => {
        $btn.button('reset');
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
        <i className="glyphicon glyphicon-pencil" style={{display: this.state.auth && this.state.auth.auth}} onClick={this.handleEdit.bind(this)}></i>
        <div className="panel panel-default" style={{display: this.state.auth && this.state.auth.read}}>
          <div className="panel-heading">
            <h3 className="panel-title">{topic.title}</h3>
          </div>
          <div className="panel-body">
            <section dangerouslySetInnerHTML={{__html: topic.html}}></section>
          </div>
          <ul className="list-group">
            {topic.comments.map((item, i) => {
              return(
                <li className="list-group-item" key={i}>
                  {item.authorId}于{item.createdAt}说：<br/>{item.content}
                </li>
              );
            })}
          </ul>
          <div className="panel-footer">
            {topic.tags.map((tag, i) => {
              return(
                <span className="label label-primary" style={{marginRight: 10}} key={i}>{tag}</span>
              );
            })}
          </div>
        </div>

        <div className="panel panel-primary" style={{display: this.state.auth && this.state.auth.edit}}>
          <div className="panel-heading">修改主题</div>
          <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-title">标题</label>
                <input type="text" className="form-control" id="ipt-title" onChange={this.handleChange.bind(this, 'title')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-tags">标签</label>
                <input type="text" className="form-control" id="ipt-tags" onChange={this.handleChange.bind(this, 'tags')} placeholder="" />
                <p className="help-block">多个标签使用半角都好分隔</p>
              </div>
              <div className="form-group">
                <label htmlFor="ipt-content">内容</label>
                <textarea type="text" className="form-control" rows="10" id="ipt-content" onChange={this.handleChange.bind(this, 'content')} placeholder=""></textarea>
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>保存</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
