import React from 'react';
import jQuery from 'jquery';
import {Link} from 'react-router';
import {login} from '../lib/client';
import {redirectURL} from '../lib/utils';

export default class Login extends React.Component{

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
    login(this.state.name, this.state.password)
      .then(ret => {
        $btn.button('reset');
        // console.log(ret);
        alert('登录成功!');
        redirectURL('/');
      })
      .catch(err => {
        $btn.button('reset');
        alert(err);
      });
  }

  render(){
    // console.log(this.props.location.query);
    const isBind = this.props.location.query.bind === '1' ? true : false;
    return(
      <div style={{width: 400, margin: 'auto'}}>
        <div className="panel panel-primary">
          <div className="panel-heading">登录</div>
          <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="ipt-name">用户名</label>
                <input type="text" className="form-control" id="ipt-name" onChange={this.handleChange.bind(this, 'name')} placeholder="" />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码</label>
                <input type="password" className="form-control" id="password" onChange={this.handleChange.bind(this, 'password')} placeholder="" />
              </div>
              <button type="button" className="btn btn-primary" onClick={this.handleLogin.bind(this)}>{isBind ? '绑定' : '登录'}</button>
              &nbsp;
              {isBind ? null : <a href="/auth/github" className="btn btn-info">使用GutHub账号登录</a>}
              <span className="pull-right">
                <Link to="/reset_password">重置密码</Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
