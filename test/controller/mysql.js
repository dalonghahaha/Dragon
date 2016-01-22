var Async = require('../../index').Async;
var Country = require('../model/country');
var Area = require('../model/area');
var Booksource = require('../model/booksource');
module.exports = {

    index:function*(dragon){
        var country_list = yield Country.query("*").limit(5).toArray();
        for(var i=0;i<country_list.length;i++){
        	country_list[i].area = yield Area.query("*").filter('id',country_list[i].AreaID).toArray();
        }
        return dragon.json(country_list);
    },

    insert:function*(dragon){
    	var data = {
    		'site':'http://www.baidu.com',
    		'name':'百度',
    		'Index':'baidu'
    	};
    	var id = yield Booksource.insert(data);
    	console.log(id);
    	return dragon.echo(id);
    },

    update:function*(dragon){
    	var data = {
    		'name':'百度 -- test'
    	};
    	var result = yield Booksource.update(8,data);
    	return dragon.echo(result);
    },

    delete:function*(dragon){
    	var result = yield Booksource.delete(9);
    	return dragon.echo(result);
    },
}
