"use strict";
var co = require('co');
var date = require('./date');

class pool {
	constructor(name,enqueue,dequeue,config) {
    	this.name = name;
    	this.size = config ? config.size : 5;
        this.period = config ? config.period : 100000;
        this.gc = config ? config.gc : 30000;
        this.resource_gc = null;
    	this.resources_pool = new Map();
        this.enqueue = enqueue;
    	this.dequeue = dequeue;
    	this.auto_gc();
  	}

  	auto_gc(){
	  	setInterval(function(){
            //console.log("gc work " + this.resources_pool.size);
            var now = date.timestamp();
            for (var key of this.resources_pool.keys()) {
                if(this.resources_pool.get(key).expire < now){
                    this.resource_gc = key;
                    this.resources_pool.get(key).gc = true;
                    //console.log("gc resource " + key);
                    this.destroy(this.resources_pool.get(key));
                    if(this.resources_pool.size < this.size){
                        co(function *(){
                            var resource = yield this.enqueue();
                            this.register(resource);
                        }.bind(this))
                    }
                    break;
                }
            }
	  	}.bind(this), this.gc);
  	}

  	status(){
  		console.log("pool size : " + this.resources_pool.size);
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
        setTimeout(function(){
            this.dequeue(resource.value).then(function(){
                this.resources_pool.delete(resource.key);
            }.bind(this));
        }.bind(this),100);
  	}

  	clear(){
  		this.resources_pool.clear();
  	}

    *init(){
        for(var i=0;i < this.size;i++){
            var resource = yield this.enqueue();
            this.register(resource);
        }
    }

    *distribute(){
        var useful = [];
        for (var key of this.resources_pool.keys()) {
            if(!this.resources_pool.get(key).gc){
                useful.push(key);
            }
        }
        if(useful.length > 0){
            var index =  parseInt(useful.length * Math.random());
            var key = useful[index];
            return this.resources_pool.get(key);
        } else {
            return null;
        }
    }

  	*require(){
  		if(this.resources_pool.size == 0){
            yield this.init();
  		}
        var resource = yield this.distribute();
        return resource;
  	}
}

module.exports = pool;