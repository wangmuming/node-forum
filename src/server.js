'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/
import path from 'path';
import ProjectCore from 'project-core';
import createDebug from 'debug';

const $ = global.$ = new ProjectCore();

//create debug function
$.createDebug = function(name) {
   return createDebug('my:'+name);
};

const debug = $.createDebug('server');

//加载配置项
$.init.add((done) => {
  $.config.load(path.resolve(__dirname,'config.js'));
  const env = process.env.NODE_ENV || null;
  if(env) {
    $.config.load(path.resolve(__dirname,'../config',env+'.js'));
  }
  $.env = env;
  done();
});

//init mongodb
$.init.load(path.resolve(__dirname,'init','mongodb.js'));

//load models
$.init.load(path.resolve(__dirname,'models'));

//init Express
$.init.load(path.resolve(__dirname,'init','express.js'));

//load routes
$.init.load(path.resolve(__dirname,'routes'));


//init
$.init((err) => {
   if (err) {
    console.error(err);
    process.exit(-1);
   } else {
     console.log('inited');
   }

});
