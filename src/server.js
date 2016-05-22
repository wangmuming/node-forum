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
    try{
      debug('load env: %s', env);
      $.config.load(path.resolve(__dirname, '../config', env + '.js'));
    }catch(err){
      // console.log(err);
      // console.log(path.resolve(__dirname, '../config', env + '.js'));
      const p = path.resolve(__dirname, '../config', env + '.js');
      const e = require(p);
      // console.log(e);
      if(typeof(e) != 'function'){
        console.error(`module "${p}" must export as a function`);
      }else{
        console.error(`There's an error in "${p}" : ${err}`);
      }
    }

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

// 初始化
$.init((err) => {
  if(err) {
    console.error(err);
    process.exit(-1);
  }else{
    // console.log('inited');
    console.log('inited [env=%s]', $.env);

    require('./test');
  }

  // 测试连接MongooDB
  // const item = new $.model.User({
  //   // name: `User${$.utils.date('Ymd')}`,
  //   name: `User${$.utils.date('YmdHis')}`,
  //   password: '123456',
  //   nickname: '测试用户'
  // });
  // item.save(console.log);

});
