module.exports = {

    set: function*(dragon) {
        var result = yield dragon.cache.set('test',11111);
        return dragon.echo(result);
    },   

    get: function*(dragon) {
        var result = yield dragon.cache.get('test');
        return dragon.echo(result);
    },

    remove: function*(dragon) {
        var result = yield dragon.cache.delete('test');
        return dragon.echo(result);
    },
}
