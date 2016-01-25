var Cache = require('../../index').Cache;
module.exports = {

    set: function*(dragon) {
        var cache = new Cache('redis',dragon.config);
        var result = yield cache.set('dalong','11111');
        return dragon.echo(result);
    },   

    get: function*(dragon) {
    	var cache = new Cache('redis',dragon.config);
        var result = yield cache.get('dalong');
        return dragon.echo(result);
    },

    remove: function*(dragon) {
    	var cache = new Cache('redis',dragon.config);
        var result = yield cache.delete('dalong');
        return dragon.echo(result);
    },
}
