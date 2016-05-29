'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/

import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github';

module.exports = function(done) {

  // 配置
  passport.use(new GitHubStrategy($.config.get('github'), function(accessToken, refreshToken, profile, callback) {

    $.method('user.get').call({githubUsername: profile.username}, (err, user) => {
      callback(err, {
        info: user,
        github: profile
      });
    });

  }));

  // 授权返回成功后执行
  $.router.get('/auth/github',passport.authenticate('github', {session: false}), function(req, res){

    if(req.user.info){
      // 用户存在
      req.session.user = req.user.info;
      req.session.logout_token = $.utils.randomString(20);
      res.redirect('/');
    }else {
      // 用户不存在
      req.session.github_user = req.user.github;
      res.redirect('/login?bind=1');
    }

  });

  done();

};
