'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

module.exports = function (done) {

  // 当前用户的信息
  $.router.get('/api/login_user',async function (req, res, next) {
    res.apiSuccess({user: req.session.user, token: req.session.logout_token});
  });

  // 登录
  $.router.post('/api/login',async function (req, res, next) {

    if(!req.body.password) return next(new Error('missing password'));

    // 登录频率限制  {}为了解决作用域的问题（ES6的新特性）
    const key = `login:${req.body.name}:${$.utils.date('Ymd')}`;
    {
      const limit = 5;
      const ok = await $.limiter.incr(key, limit);
      if(!ok) throw new Error('out of limit');
    }

    const user = await $.method('user.get').call(req.body);
    if(!user) return next(new Error('user does not exists'));

    if(!$.utils.validatePassword(req.body.password, user.password)){
      return next(new Error('incorrect password'));
    }

    req.session.user = user;
    // 随机生成 token
    req.session.logout_token = $.utils.randomString(20);

    // 登陆成功后 key 重置
    await $.limiter.reset(key);

    res.apiSuccess({token:req.session.logout_token});

  })

  // 登出
  $.router.get('/api/logout',async function (req, res, next) {

    if(req.session.logout_token && req.query.token !== req.session.logout_token){
      // console.log(req.query);
      // console.log(req.query.token);
      // console.log(req.session.logout_token);
      return next(new Error('invalid token'));
    }

    delete req.session.user;
    delete req.session.logout_token;

    res.apiSuccess({});

  })

  // 登出
  $.router.post('/api/logout',async function (req, res, next) {

    delete req.session.user;
    delete req.session.logout_token;

    res.apiSuccess({});

  })

  // 注册
  $.router.post('/api/signup',async function (req, res, next) {

    // 注册频率限制  {}为了解决作用域的问题（ES6的新特性）
    {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const key = `signup:${ip}:${$.utils.date('Ymd')}`;
      const limit = 2;
      const ok = await $.limiter.incr(key, limit);
      if(!ok) throw new Error('out of limit');
    }

    const user = await $.method('user.add').call(req.body);

    res.apiSuccess({user: user});

  })

  done();

};
