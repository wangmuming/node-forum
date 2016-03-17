'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/


import mongoose from 'mongoose';

module.exports = function (done) {

   const conn = mongoose.createConnection($.config.get('db.mongodb'));	
   
   $.mongodb = conn;
   
   $.model = {};

   done();
}
