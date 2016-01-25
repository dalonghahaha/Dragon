var Cache = require('../../index').Cache;
module.exports = {

    set: function*(dragon) {
        var cache = new Cache('memcached',dragon.config);
        var result = yield cache.set('test',11111);
        return dragon.echo(result);
    },   

    get: function*(dragon) {
    	var cache = new Cache('memcached',dragon.config);
        var result = yield cache.get('test');
        return dragon.echo(result);
    },

    remove: function*(dragon) {
    	var cache = new Cache('memcached',dragon.config);
        var result = yield cache.delete('test');
        return dragon.echo(result);
    },
}
