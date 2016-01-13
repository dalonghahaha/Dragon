"use strict";

class async {
	static map(mission,promise) {
    	return new Promise(
    		function(resolve, reject) {
    			try{
					var data = [];
					var count = 0;
	    			for (var i = 0; i <mission.length; i++) {
	    				promise(mission[i]).then(function(result){
	    					data.push(result);
	    					count++; 
	    				}).catch(reject);
	    			};
	    			setTimeout(function(){
	    				if(count == mission.length){
	    					resolve(data);
	    				}
	    			},200);
	            }
	            catch(err){
	                reject(err);
	            }
    			
    		}
    	);
  	}
}

module.exports = async;