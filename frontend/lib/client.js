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
  return request('get', 'topic/list', {});
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
