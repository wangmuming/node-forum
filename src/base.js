'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

import path from 'path';
import projectCore from 'project-core';
import createDubug from 'debug';

const $ = global.$ = new projectCore();


// 创建Debug函数
$.createDubug = function (name) {
  return createDubug('my:' + name);
}
const debug = $.createDubug('server');


// 加载配置文件
$.init.add((done) => {
  $.config.load(path.resolve(__dirname, 'config.js'));
  const env = process.env.NODE_ENV || null;

  if(env) {
    env.split(',').forEach(e => {
      debug('load env: %s', e);
      $.config.load(path.resolve(__dirname, '../config', e + '.js'));
    });
  }
  $.env = env;
  done();
});

// 初始化MongooDB
$.init.load(path.resolve(__dirname, 'init', 'mongodb.js'));
// 加载models
$.init.load(path.resolve(__dirname, 'models'));

//加载methods(功能模块)
$.init.load(path.resolve(__dirname, 'methods'));


// 初始化Express
$.init.load(path.resolve(__dirname, 'init', 'express.js'));
// 初始化中间件
$.init.load(path.resolve(__dirname, 'middlewares'));
//加载路由
$.init.load(path.resolve(__dirname, 'routes'));

// 初始化limiter
$.init.load(path.resolve(__dirname, 'init', 'limiter.js'));
// 初始化captcha
$.init.load(path.resolve(__dirname, 'init', 'captcha.js'));
