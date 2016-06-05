'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

/*
$.method('user.add').call({
  name: '1',
  email: '22222@qq.com',
  password: '123456',
  nickname: '11111',
  about: '22222222',
}, console.log);


$.method('user.get').call({
  name: 'hello',
}, console.log);


$.method('user.update').call({
  name: 'hello',
  nickname: '123',
}, console.log);
*/


import supertest from 'supertest';
import './base';

// 清空redis数据
$.init.add(async function() {
  const keys = await $.limiter.connection.keys($.config.get('limiter.redis.prefix') + '*')
  if(keys.length > 0){
    await $.limiter.connection.del(keys);
  }
});
$.init.add(async function() {
  const keys = await $.captcha.connection.keys($.config.get('captcha.redis.prefix') + '*')
  if(keys.length > 0){
    await $.captcha.connection.del(keys);
  }
});

// 清空mongo数据库
$.init.add(done => {
  $.mongodb.db.dropDatabase(done);
});
$.init.add(async function() {
  const data = require('./test.db');
  for(const name in data){
    for(const item of data[name]){
      await $.mongodb.db.collection(name).save(item);
    }
  }
});

// 初始化
$.init((err) => {
  if(err) {
    console.error(err);
    process.exit(-1);
  }else{
    console.log('inited [env=%s]', $.env);
  }
});

function makeRequest(agent, method, path, params){
  return new Promise((resolve, reject) => {
    $.ready(() => {
      params = params || {};
      agent = agent || supertest($.express);
      let req = agent[method](path);
      if(method === 'get' || method === 'head'){
        req = req.query(params);
      }else {
        req = req.send(params);
      }
      req.expect(200).end((err, res) => {
        if(err) return reject(err);
        if(res.body.success){
          resolve(res.body.result);
        }else {
          reject(new Error(res.body.error));
        }
      });
    });
  });
}

function generateRequestMethod(agent, method){
  return function(path, params){
    return makeRequest(agent, method, path, params);
  }
}

function generateRequestSuite(agent){
  return {
    get: generateRequestMethod(agent, 'get'),
    post: generateRequestMethod(agent, 'post'),
    put: generateRequestMethod(agent, 'put'),
    delete: generateRequestMethod(agent, 'delete')
  };
}

export var request = generateRequestSuite(false);
export function session(){
  return generateRequestSuite(supertest.agent($.express));
}

