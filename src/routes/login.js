'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

module.exports = function (done) {

  // ��ǰ�û�����Ϣ
  $.router.get('/api/login_user',async function (req, res, next) {
    res.apiSuccess({user: req.session.user, token: req.session.logout_token});
  });

  // ��¼
  $.router.post('/api/login',async function (req, res, next) {

    if(!req.body.password) return next(new Error('missing password'));

    // ��¼Ƶ������  {}Ϊ�˽������������⣨ES6�������ԣ�
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
    // ������� token
    req.session.logout_token = $.utils.randomString(20);

    if(req.session.github_user){
      await $.method('user.update').call({
        _id: user._id,
        githubUsername: req.session.github_user.username
      });
      delete req.session.github_user;
    }

    // ��½�ɹ��� key ����
    await $.limiter.reset(key);

    res.apiSuccess({token:req.session.logout_token});

  })

  // �ǳ�
  $.router.get('/api/logout',async function (req, res, next) {

    if(req.session.logout_token && req.query.token !== req.session.logout_token){
      return next(new Error('invalid token'));
    }

    delete req.session.user;
    delete req.session.logout_token;

    res.apiSuccess({});

  })

  // �ǳ�
  $.router.post('/api/logout',async function (req, res, next) {

    delete req.session.user;
    delete req.session.logout_token;

    res.apiSuccess({});

  })

  // ע��
  $.router.post('/api/signup',async function (req, res, next) {

    // ע��Ƶ������  {}Ϊ�˽������������⣨ES6�������ԣ�
    {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const key = `signup:${ip}:${$.utils.date('Ymd')}`;
      const limit = 2;
      const ok = await $.limiter.incr(key, limit);
      if(!ok) throw new Error('out of limit');
    }

    const user = await $.method('user.add').call(req.body);

    $.method('mail.sendTemplate').call({
      to: user.email,
      subject: '��ӭ',
      template: 'welcome',
      data: user
    }, err => {
      if (err) {
        console.error(err);
      }
    });

    res.apiSuccess({user: user});

  })

  done();

};
