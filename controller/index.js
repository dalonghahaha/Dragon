"use strict"
var response=require('../lib/response');

class category extends response{

	constructor(_requeset){
		super(_requeset);
	}

	index(){
		return new Promise(function(resolve, reject) {
			try{
				resolve(response.echo('hello world!'));
			}
			catch(err){
				reject(err);
			}
		});
	}
}

module.exports = category;