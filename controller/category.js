"use strict"
var response=require('../lib/response');
var model=require('../model/category');

class category extends response{

	constructor(_requeset){
		super(_requeset);
	}

	get_list(){
		return new Promise(function(resolve, reject) {
			var model_category = new model();
			model_category.find({}).then(function(data) {
				resolve(category.json(data));
			}).catch(reject);
		});
	}
}

module.exports = category;