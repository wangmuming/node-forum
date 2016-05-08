import React from 'react';
import jQuery from 'jquery';
import {signup} from '../lib/client';
import {redirectURL} from '../lib/utils';

// const footerStyle = {
//   marginTop: 50,
//   padding: 20
// };

export default class Signup extends React.Component{

  constructor(pros){
    super(pros);
    this.state = {};
  }

  // 输入‘用户名’‘密码’检测
  handleChange(name, e){
    // console.log(name, e.target.value);
    this.state[name] = e.target.value;
  }

  // 点击‘登录’
  handleLogin(e){
    const $btn = jQuery(e.target);
    $btn.button('loading');
    signup(this.state.name, this.state.email, this.state.password, this.state.nickname)
      .then(ret => {
        $btn.button('reset');
        alert('注册成功!');
        redirectURL('/login');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  render(){
    return(
      <div style={{width: 400, margin: 'auto'}}>
        <div className="panel panel-primary">
          <div className="panel-heading">注册</div>
          <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-name">用户名</label>
                <input type="text" className="form-control" id="ipt-name" onChange={this.handleChange.bind(this, 'name')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-email">邮箱</label>
                <input type="text" className="form-control" id="ipt-email" onChange={this.handleChange.bind(this, 'email')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="ipt-nickname">昵称</label>
                <input type="text" className="form-control" id="ipt-nickname" onChange={this.handleChange.bind(this, 'nickname')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input type="password" className="form-control" id="password" onChange={this.handleChange.bind(this, 'password')} placeholder="" />
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleLogin.bind(this)}>注册</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
