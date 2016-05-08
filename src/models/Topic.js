'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

import mongoose from 'mongoose';

module.exports = function (done) {
  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  const Topic = new Schema({
    author: {type: ObjectId, index: true, ref: 'User'}, //index索引   ref 表示关联到User表
    title: {type:String, trim: true}, //trim自动去掉首尾的空格
    content: {type: String},
    tags: [{type: String, index: true}],  //字符串数组
    createdAt: {type: Date, index: true},
    updatedAt: {type: Date, index: true},
    lastCommentAt: {type: Date, index: true},
    comments: [{
      author: {type: ObjectId, ref: 'User'},
      content: String,
      createdAt: Date
    }]
  });

  $.mongodb.model('Topic', Topic);
  $.model.Topic = $.mongodb.model('Topic');

  done();

}
