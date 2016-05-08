'use strict';

/**
* practice Node.js project
*
* @author William Wang <wangmuming_0218@126.com>
*/
module.exports = function (done) {


  // 用了中间件捕捉错误信息有异常，改进server.js中的routerWrap
  // 增加topic记录
  $.router.post('/api/topic/add',$.checkLogin, async function (req, res, next) {

    req.body.author = req.session.user._id;

    console.log(1, req.body);
    if('tags' in req.body){
      req.body.tags = req.body.tags.split(',').map(v => v.trim()).filter(v => v);
    }
    const topic = await $.method('topic.add').call(req.body);
     res.apiSuccess({topic});

  });


  // 获取topic的list
  $.router.get('/api/topic/list', async function (req, res, next) {

    if('tags' in req.query){
      req.query.tags = req.query.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    let pageNo = parseInt(req.query.pageNo, 10);
    if(!(pageNo > 1)) pageNo = 1;
    req.query.limit = 10;
    req.query.skip = (pageNo - 1) * req.query.limit;

    const list = await $.method('topic.list').call(req.query);

    const count = await $.method('topic.count').call(req.query);
    // 总共的页数
    const pageNos = Math.ceil(count / req.query.limit);

    res.apiSuccess({count, pageNo, pageNos, list});

  });

  // 获取某具体的topic
  $.router.get('/api/topic/item/:topic_id', async function (req, res, next) {

    const topic = await $.method('topic.get').call({_id: req.params.topic_id});
    if(!topic) return next(new Error(`topic ${req.params.topic_id} does not exists`));

    const userId = req.session.user && req.session.user._id && req.session.user._id.toString();
    const isAdmin = req.session.user && req.session.user.isAdmin;

    const result = {};
    result.topic = $.utils.cloneObject(topic);
    result.topic.permission = {
      edit: isAdmin || userId === result.topic.author._id,
      delete: isAdmin || userId === result.topic.author._id
    };
    result.topic.comments.forEach(item => {
      item.permission = {
        delete: isAdmin || userId === item.author._id
      };
    });

    res.apiSuccess(result);

  });

  // 修改某具体的topic
  $.router.post('/api/topic/item/:topic_id', $.checkLogin, $.checkTopicAuthor, async function (req, res, next) {

    if('tags' in req.body){
      req.body.tags = req.body.tags.split(',').map(v => v.trim()).filter(v => v);
    }

    req.body._id = req.params.topic_id;
    await $.method('topic.update').call(req.body);

    const topic = await $.method('topic.get').call({_id: req.params.topic_id});

    res.apiSuccess({topic});

  });

  // 删除某具体的topic
  $.router.delete('/api/topic/item/:topic_id', $.checkLogin, $.checkTopicAuthor, async function (req, res, next) {

    const topic = await $.method('topic.delete').call({_id: req.params.topic_id});

    res.apiSuccess({topic});

  });

  // 增加topic的评论
  $.router.post('/api/topic/item/:topic_id/comment/add', $.checkLogin, async function (req, res, next) {

    req.body._id = req.params.topic_id;
    // console.log(req.session.user._id);
    req.body.author = req.session.user._id;
    const comment = await $.method('topic.comment.add').call(req.body);

    res.apiSuccess({comment});

  });

  // 获取topic的某条评论
  $.router.post('/api/topic/item/:topic_id/comment/get', async function (req, res, next) {

    req.body._id = req.params.topic_id;

    const comment = await $.method('topic.comment.get').call({
      _id: req.params.topic_id,
      cid: req.body.cid
    });

    res.apiSuccess({comment});

  });

  // 删除topic的某条评论
  $.router.post('/api/topic/item/:topic_id/comment/delete', $.checkLogin, async function (req, res, next) {

    req.body._id = req.params.topic_id;

    const query = {
      _id: req.params.topic_id,
      cid: req.body.cid
    };
    const comment = await $.method('topic.comment.get').call(query);

    if(comment && comment.comments && comment.comments[0]){
      const item = comment.comments[0];
      if(req.session.user.isAdmin || item.author.toString() === req.session.user._id.toString()){
        await $.method('topic.comment.delete').call(query);
      }else{
        return next(new Error('access denied'));
      }
    }else{
      return next(new Error('comment does not exists'));
    }

    res.apiSuccess({comment: comment.comments[0]});

  });

  done();

};
