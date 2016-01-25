"use strict"

class cache {
	constructor(type,config) {
		this.type = type;
		if(type == "memcached"){
			this.cache = require('../cache/memcached');
			this.pool = this.cache.get_pool(config);
		}else if(type == "redis"){
			this.cache = require('../cache/redis');
			this.pool = this.cache.get_pool(config);
		}
	}

	*get_client(){
		var cache_client = yield this.pool.require();
		return cache_client.value;
	}

	*set(key,value,lifetime){
		var cache_client = yield this.get_client();
		return new Promise(
			function(resolve, reject) {
				if(this.type == "memcached"){
					var life = lifetime ? lifetime : 600;
					cache_client.set(key,value,life,function(err){
						if(err){
							reject(err);
						} else {
							resolve(true);
						}
					});
				} else if(this.type == "redis"){
					try{
						cache_client.set(key,value);
					}catch(err){
						reject(err);
					}
					resolve(true);
				}
			}.bind(this)
		);
	}

	*get(key){
		var cache_client = yield this.get_client();
		return new Promise(
			function(resolve, reject) {
				cache_client.get(key,function(err,data){
					if(err){
						reject(err);
					} else {
						resolve(data);
					}
				})
			}.bind(this)
		);  		
	}

	*delete(key){
		var cache_client = yield this.get_client();
		return new Promise(
			function(resolve, reject) {
				cache_client.del (key,function(err){
					if(err){
						reject(err);
					} else {
						resolve(true);
					}
				})
			}.bind(this)
		);  		
	}
}


module.exports = cache;