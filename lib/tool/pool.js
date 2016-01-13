"use strict";

class pool {
	constructor(name,enqueue,dequeue,config) {
    	this.name = name;
    	this.max = config ? config.max : 10;
    	this.min = config ? config.min : 2;
    	this.resources_pool = [];
    	this.enqueue = enqueue;
    	this.dequeue = dequeue;
    	//this.auto_gc();
  	}

  	auto_gc(){
	  	setInterval(function(){
	  		if(this.resources_pool.length > this.min){
	  			console.log('gc work ' + this.resources_pool.length);
	  			this.destroy(this.resources_pool[0]);
	  			this.resources_pool.shift();
	  		}
	  	}.bind(this), 5000);
  	}

  	status(){
  		console.log(this.resources_pool.length);
  	}

  	register(resource) {
  		this.resources_pool.push(resource);
  	}

  	destroy(resource){
  		this.dequeue(resource);
  	}

  	clear(){
  		this.resources_pool.clear();
  	}

  	require(){
  		return new Promise(function(resolve, reject) {
	  		if(this.resources_pool.length > 0){
	  			if(this.resources_pool.length < this.max){
		  			this.enqueue().then(function(result){
			  			this.register(result);
			  		}.bind(this));
	  			}	  		
	  			resolve(this.resources_pool[0]);
	  		} else {
		  		this.enqueue().then(function(result){
		  			this.register(result);
		  			resolve(result);
		  		}.bind(this)).catch(reject);
	  		}
        }.bind(this));
  	}
}

module.exports = pool;