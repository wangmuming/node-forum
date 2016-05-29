import browserRequest from 'browser-request';

const urlBase = '/api';

export function request(method, path, data = {}) {
  return new Promise((resolve, reject) => {
    path = path.replace(/^\/+/, '');
    method = method.toUpperCase();
    const options = {
      method,
      url: `${urlBase}/${path}`,
    };
    if (method === 'GET' || method === 'HEAD') {
      options.qs = data;
    } else {
      options.form = data;
    }
    browserRequest(options, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        let data;
        try {
          data = JSON.parse(body.toString());
        } catch (err) {
          return reject(new Error('parse JSON data error: ' + err.message));
        }
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      }
    });
  });
}

// 获取话题列表
export function getTopicList(options) {
  return request('get', 'topic/list', options);
}

// 获取评论详情
export function getTopicDetail(id) {
  return request('get', `topic/item/${id}`).then(ret => ret.topic);
}

// 用户登录
export function login(name, password) {
  return request('post', 'login', {name, password});
}

// 检查登录状态
export function loginUser() {
  return request('get', 'login_user').then(ret => ret.user);
}

// 用户注销
export function logout() {
  return request('post', 'logout');
}

// 发表话题
export function addTopic(title, content, tags) {
  return request('post', 'topic/add', {title, content, tags}).then(ret => ret.topic);
}

// 修改话题
export function updateTopic(id, title, content, tags) {
  return request('post', `topic/item/${id}`, {title, content, tags}).then(ret => ret.topic);
}

// 发表评论
export function addComment(id, content) {
  return request('post', `topic/item/${id}/comment/add`, {content}).then(ret => ret.comment);
}

// 删除评论
export function deleteComment(id, cid) {
  return request('post', `topic/item/${id}/comment/delete`, {cid});
}

// 用户注册
export function signup(name, email, password, nickname) {
  return request('post', 'signup', {name, email, password, nickname});
}

// 修改用户信息
export function updateProfile(nickname, email, about) {
  return request('post', 'user/profile', {nickname, email, about});
}

// 删除主题
export function deleteTopic(id) {
  return request('delete', `topic/item/${id}`);
}

// 获取通知消息数
export function notificationCount(isRead) {
  return request('get', `notification/count`, {isRead}).then(ret => ret.count);
}

// 获取通知消息列表
export function notificationList() {
  return request('get', `notification/list`);
}

// 获取通知消息列表数据设为已读
export function notificationSetRead(id) {
  return request('post', `notification/${id}/read`);
}

// 获取重置密码的验证码
export function requestResetPassword(email) {
  return request('post', '/user/request_reset_password', {email});
}

// 重置密码
export function resetPassword(code, email, password) {
  return request('post', '/user/reset_password', {code, email, password});
}
