var Async = require('../../index').Async;
var category = require('../model/category');

module.exports = {

    find:function*(dragon) {        
        var category_list = yield category.query('name,slug').limit(10).sort('slug',1).toArray();
        var data = yield Async.map(category_list,function(){
            return category.query('name,slug').limit(3).sort('slug',1).toArray();
        });
        dragon.logger.info('finish');
        return dragon.json(data);
    },

    add: function*(dragon) {
        var category = require('../model/category');
        var data = {
            'name':'逗你玩',
            'slug':'doubi',
            'description':'逗比',
            'order':0,
            'ispublish':1
        };
        var id = yield category.insert(data);
        return dragon.echo(id);
    },

    modify:function*(dragon){
        var category = require('../model/category');
        var data = {
            'name':'逗你玩1111111111111111111111'
        };
        var result = yield category.update('568e387439306ca429b1ef5d',data);
        return dragon.echo(result);
    },

    remove: function*(dragon) {
        var category = require('../model/category');
        var result = yield category.delete('5694baeb7543d79064012880');
        return dragon.echo(result);
    }
}
