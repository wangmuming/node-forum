'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

module.exports = function (set, get, has) {

  // ·þÎñÆ÷¼àÌý¶Ë¿Ú
  set('web.port', 3000);

  // session secret
  set('web.session.secret', 'test');

  // session redis connection
  set('web.session.redis', {
    host: '127.0.0.1',
    port: 6379,
  });

};
