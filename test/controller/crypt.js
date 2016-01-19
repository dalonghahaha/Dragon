var crypto = require('../../index').Crypt;

module.exports = {

    md5: function(dragon) {
        var test = crypto.md5('nimabi');
        return dragon.echo(test);
    },
    
    encrypt: function(dragon){
        var test = crypto.encrypt('nimabi','123456');
        return dragon.echo(test);
    },

    decrypt: function(dragon){
        var test = crypto.decrypt('78d4d569f846c659a14e37b977285a6c','123456');
        return dragon.echo(test);
    },

    base64encode: function(dragon) {
        var test = crypto.base64encode('pc27149');
        return dragon.echo(test);
    }
}
