var Async = require('../../index').Async;
var post = require('../model/post');
module.exports = {

    index:function*(dragon){
        var result = yield post.query("pid,title").filter('status','publish').limit(5).sort('pid','asc').sort('created','desc').toArray();
        var data = yield Async.map(result,function(){
            return post.query("pid,title").filter('status','publish').limit(5).toArray();
        });
        dragon.logger.info('finish');
        return dragon.json(data);
    },
}
