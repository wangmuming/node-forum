import React from 'react';
import {loginUser, updateProfile} from '../lib/client';

export default class profile extends React.Component{

  constructor(pros){
    super(pros);
    this.state = {};
  }

  componentDidMount(){
    loginUser()
      .then(user => this.setState(user))
      .catch(err => console.error(err));
  }

  // 输入检测
  handleChange(name, e){
    this.setState({[name]: e.target.value});
  }

  // 点击‘保存’
  handleSave(e){
    const $btn = jQuery(e.target);
    $btn.button('loading');
    updateProfile(this.state.nickname, this.state.email, this.state.about)
      .then(ret => {
        $btn.button('reset');
        alert('修改成功!');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  render(){
    if(!this.state._id){
      return(
        <p>正在加载...</p>
      );
    }
    return(
      <div style={{width: 400, margin: 'auto'}}>
        <div className="panel panel-primary">
          <div className="panel-heading">{this.state.name} 的个人设置</div>
          <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-nickname">昵称</label>
                <input type="text" className="form-control" value={this.state.nickname} id="ipt-nickname" onChange={this.handleChange.bind(this, 'nickname')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-email">邮箱</label>
                <input type="email" className="form-control" value={this.state.email} id="ipt-email" onChange={this.handleChange.bind(this, 'email')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="about">个人介绍</label>
                <textarea type="text" className="form-control" value={this.state.about} id="about" onChange={this.handleChange.bind(this, 'about')} placeholder=""></textarea>
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleSave.bind(this)}>保存</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
