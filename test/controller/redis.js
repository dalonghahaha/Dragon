module.exports = {

    set: function*(dragon) {
        var result = yield dragon.cache.set('dalong','11111');
        return dragon.echo(result);
    },   

    get: function*(dragon) {
        var result = yield dragon.cache.get('dalong');
        return dragon.echo(result);
    },

    remove: function*(dragon) {
        var result = yield dragon.cache.delete('dalong');
        return dragon.echo(result);
    },
}
