module.exports = {

    get: function(dragon) {
        var id = dragon.params.get.id;
        return dragon.json({
            method:'get',
            id:id
        });
    },

    post: function(dragon) {
        var name = dragon.params.post.name;
        return dragon.json({
            method:'post',
            name:name
        });
    },

    put:function(dragon){
        var name = dragon.params.post.name;
        return dragon.json({
            method:'put',
            name:name
        });
    },

    delete: function(dragon) {
        var id = dragon.params.get.id;
        return dragon.json({
            method:'delete',
            id:id
        });
    }
    
}
