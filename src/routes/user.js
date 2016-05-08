'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

module.exports = function (done) {

  // 更新用户的信息
  $.router.post('/api/user/profile', $.checkLogin, async function (req, res, next) {

    const update = {
      _id: req.session.user._id
    };
    if('email' in req.body) update.email = req.body.email;
    if('nickname' in req.body) update.nickname = req.body.nickname;
    if('about' in req.body) update.about = req.body.about;

    const ret = await $.method('user.update').call(update);

    // 更新当前的用户信息
    const user = await $.method('user.get').call({_id: req.session.user._id});
    req.session.user.email = user.email;
    req.session.user.nickname = user.nickname;
    req.session.user.about = user.about;

    res.apiSuccess(user);

  })


  done();

};
