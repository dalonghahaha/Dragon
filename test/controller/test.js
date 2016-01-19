module.exports = {

    redirect:function(dragon){
        return dragon.redirect('http://www.baidu.com');
    },

    params:function(dragon){
        return dragon.json(dragon.params);
    },

    request:function(dragon){
        return dragon.json(dragon._request);
    }
}
