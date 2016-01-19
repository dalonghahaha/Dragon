module.exports = {

    set: function(dragon) {
        dragon.set_cookie('user_id',1024);
        return dragon.echo('Hello Dragon');
    },
    
    remove: function(dragon){
        dragon.remove_cookie('user_id');
        return dragon.echo('Hello Dragon');
    }
}
