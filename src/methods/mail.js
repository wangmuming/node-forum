'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/


import fs from 'fs';
import path from 'path';
import rd from 'rd';
import ejs from 'ejs';
import nodemailer from 'nodemailer';

module.exports = function (done) {

  $.smtp = nodemailer.createTransport($.config.get('smtp'), {
    from: $.config.get('smtp.auth.user')
  });

  const templates = {};
  rd.eachFileFilterSync(path.resolve(__dirname, '../../email_templates'), /\.html/, (f, s) => {
    const name = path.basename(f, '.html');
    const html = fs.readFileSync(f).toString();
    templates[name] = ejs.compile(html);
  });

  $.method('mail.send').check({
    to: {required: true}, // 多个邮箱地址以逗号分割
    subject: {required: true},
    html: {required: true}
  });
  $.method('mail.send').register(function(params, callback){

    $.smtp.sendMail(params, callback);

  });

  $.method('mail.sendTemplate').check({
    to: {required: true}, // 多个邮箱地址以逗号分割
    subject: {required: true},
    template: {required: true}
  });
  $.method('mail.sendTemplate').register(function(params, callback){

    const fn = templates[params.template];
    if(!fn) throw new Error(`invaild email template "${params.template}"`);

    const html = fn(params.data || {});

    return $.method('mail.send').call({
      to: params.to,
      subject: params.subject,
      html: html
    });

  });

  // $.method('mail.sendTemplate').call({
  //   to: 'sql370@qq.com',
  //   subject: '欢迎',
  //   template: 'welcome',
  //   data: {
  //     username: 'ucdoj'
  //   }
  // },console.log);

  done();

}
