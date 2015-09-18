"use strict"
var response=require('../lib/response');
var model=require('../model/category');

class category extends response{

	constructor(_requeset){
		super(_requeset);
		this.model = new model();
	}

	list(){
		var list = this.model.find();
		return this.json(list);
	}
}