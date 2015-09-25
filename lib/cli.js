var path = require('path');
var fs = require("fs");
var root = path.dirname(__dirname);
var cli = module.exports = {
    init: function(options) {
    	console.log('begin init ......');
    	
    	//初始化根目录
    	var root_dir_list = ['controller','schema','model','views','logs','assets'];
    	cli.init_dir(root_dir_list);

    	//初始化日志文件目录
    	var log_list=['logs/debug','logs/err','logs/info','logs/trace','logs/warn'];
    	cli.init_dir(log_list);
    	
    	var root_
    	if(options.demo){
    		console.log('begin init demo code......');
    	}
    	console.log('begin finish !');
    },
    build: function(category,name) {
    	console.log('begin build ......');
    },
   	init_dir:function(list){
   		for( p in list){
   			console.log("mkdir "+ list[p]);
   			var _path = path.join(root,list[p]);
   			if(!fs.existsSync(_path)){
   				fs.mkdirSync(_path,0755);
   			}
   		}
   	}
}
