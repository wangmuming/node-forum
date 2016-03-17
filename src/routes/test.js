'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

module.exports = function (done) {

  $.router.get('/',function(req,res,next) {
     res.end('hello world');
  });

  done();
 
};
