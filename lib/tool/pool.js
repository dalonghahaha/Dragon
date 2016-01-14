"use strict";

var date = require('./date');

class pool {
	constructor(name,enqueue,dequeue,config) {
    	this.name = name;
    	this.max = config ? config.max : 20;
    	this.min = config ? config.min : 2;
        this.period = config ? config.period : 600;
        this.gc = config ? config.gc : 10000;
        this.resources_count = 0;
    	this.resources_pool = new Map();
    	this.enqueue = enqueue;
    	this.dequeue = dequeue;
    	this.auto_gc();
  	}

  	auto_gc(){
	  	setInterval(function(){
            console.log('gc work ' + this.resources_pool.size);
	  		if(this.resources_pool.size > this.min){
                for (var key of this.resources_pool.keys()) {
                    if(!this.resources_pool.get(key).gc){
                        this.destroy(this.resources_pool.get(key));
                        break;
                    }
                }
	  		} else {
                var now = date.timestamp();
                for (var key of this.resources_pool.keys()) {
                    if(!this.resources_pool.get(key).expire < now){
                        this.destroy(this.resources_pool.get(key));
                        break;
                    }
                }
            }
	  	}.bind(this), this.gc);
  	}

  	status(){
  		console.log(this.resources_pool.size);
  	}

  	register(resource) {
        var time = date.timestamp();
        var key = this.name + "_" + time;
  		this.resources_pool.set(key,{
            'key': key,
            'value':resource,
            'gc':false,
            'expire':time + this.period
        });
        return key;
  	}

  	destroy(resource){
        this.resources_pool.delete(resource.key);
        this.resources_count -= 1;
        this.dequeue(resource.value);
  	}

  	clear(){
        this.resources_count = 0;
  		this.resources_pool.clear();
  	}

  	require(){
  		return new Promise(
            function(resolve, reject) {
    	  		if(this.resources_pool.size > 0){
    	  			if(this.resources_count < this.max){
                        this.resources_count +=1;
    		  			this.enqueue().then(function(result){
    			  			this.register(result);
    			  		}.bind(this)).catch(function(err){
                            this.resources_count -=1;
                        }.bind(this));
    	  			}
                    var useful = [];
                    for (var key of this.resources_pool.keys()) {
                        if(!this.resources_pool.get(key).gc){
                            useful.push(key);
                        }
                    }
                    if(useful.length > 0){
                        var index =  parseInt(useful.length * Math.random());
                        resolve(this.resources_pool.get(useful[index]));
                    } else {
                        reject(new Error('no useful resource'));
                    }
    	  		} else {
    		  		this.enqueue().then(function(result){
                        this.resources_count +=1;
    		  			var key = this.register(result);
    		  			resolve({
                            'key': key,
                            'value':result,
                            'gc':false
                        });
    		  		}.bind(this)).catch(reject);
    	  		}
            }.bind(this)
        );
  	}
}

module.exports = pool;