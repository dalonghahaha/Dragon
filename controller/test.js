var test = module.exports = {
    index: function(dragon) {
        return dragon.render({});
    },
    get_cookie:function(dragon){
    	return dragon.json(dragon.cookie);
    },
    set_cookie:function(dragon){
    	dragon.set_cookie({key: "username", value: "Jackson"});
		dragon.set_cookie({key: "password", value: "xxxxxx"});
    	return dragon.render({},'test/index');
    }
}
