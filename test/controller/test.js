module.exports = {

    redirect:function(dragon){
        return dragon.redirect('http://www.baidu.com');
    },

    params:function(dragon){
    	console.log(dragon.params);
        return dragon.echo('成功');
    },

    request:function(dragon){
        return dragon.json(dragon._request);
    }
}
