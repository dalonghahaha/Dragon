var test = module.exports = {
    index: function(dragon) {
        return dragon.render({});
    },
    get_cookie:function(dragon){
        console.log(dragon.cookie);
    	return dragon.json(dragon.cookie);
    },
    set_cookie:function(dragon){
    	dragon.set_cookie('username','dalong');
        dragon.set_cookie('tiantian','256',{'httpOnly':false,'path':'/test'});
		dragon.set_cookie('uid','1000',{'expires':60});
    	return dragon.render({},'test/index');
    },
    remove_cookie:function(dragon){
        dragon.remove_cookie('tiantian');
        return dragon.render({},'test/index');
    }
}
