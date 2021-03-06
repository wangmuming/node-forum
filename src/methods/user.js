'use strict';


/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

import validator from 'validator';
module.exports = function (done) {
  //验证
  $.method('user.add').check({
    name: {required: true, validate: (v) => validator.isLength(v, {min: 4,max: 20}) && /^[a-zA-Z]/.test(v)},
    email: {required: true, validate: (v) => validator.isEmail(v)},
    // password: {required: true, validate: (v) => typeof v === 'string' && v.length >= 6},
    password: {required: true, validate: (v) => validator.isLength(v, {min: 6})},
  });

  //功能
  $.method('user.add').register(async function(params){
    params.name = params.name.toLowerCase();
    //const的作用域在花括号内
    {
      const user = await $.method('user.get').call({name: params.name});
      if(user) throw new Error(`user ${params.name} already exists`);
    }
    {
      const user = await $.method('user.get').call({email: params.email});
      if(user) throw new Error(`user ${params.email} already exists`);
    }

    params.password = $.utils.encryptPassword(params.password.toString());
    const user = new $.model.User({
      name: params.name,
      email: params.email,
      nickname: params.nickname,
      password: params.password,
      about: params.about
    });
    return user.save();

  });

  //验证
  $.method('user.get').check({
    _id: {validate: (v) => validator.isMongoId(String(v))},
    name: {validate: (v) => validator.isLength(v, {min: 4,max: 20}) && /^[a-zA-Z]/.test(v)},
    email: {validate: (v) => validator.isEmail(v)}
  });

  $.method('user.get').register(async function(params){

    const query = {};
    if(params._id){
      query._id = params._id;
    }else if(params.name){
      query.name = params.name;
    }else if (params.email) {
      query.email = params.email;
    } else if (params.githubUsername) {
      query.githubUsername = params.githubUsername;
    }else{
      throw new Error('missing parameter _id | name | email');
    }

    return $.model.User.findOne(query);

  });


  //验证
  $.method('user.update').check({
    _id: {validate: (v) => validator.isMongoId(String(v))},
    name: {validate: (v) => validator.isLength(v, {min: 4,max: 20}) && /^[a-zA-Z]/.test(v)},
    email: {validate: (v) => validator.isEmail(v)}
  });

  $.method('user.update').register(async function(params){

    const user  = await $.method('user.get').call(params);
    if(!user){
      throw new Error('user does not exists');
    }

    const update = {};
    if(params.name && user.name != params.name) update.name = params.name;
    if(params.email && user.email != params.email) update.email = params.email;
    if(params.githubUsername && user.githubUsername != params.githubUsername) update.githubUsername = params.githubUsername;
    if(params.password && user.password != params.password) update.password = $.utils.encryptPassword(params.password);
    if(params.nickname && user.nickname != params.nickname) update.nickname = params.nickname;
    if(params.about && user.about != params.about) update.about = params.about;

    return $.model.User.update({_id: user._id}, {$set: update});

  });

  // 增加用户积分
  $.method('user.incrScore').check({
    _id: {validate: (v) => validator.isMongoId(String(v)), required: true},
    score: {validate: (v) => !isNaN(v), required: true}
  });

  $.method('user.incrScore').register(async function(params){

    return $.model.User.update({_id: params._id}, {$inc: {score: params.score}});

  });



  done();

}
