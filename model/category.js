"use strict";
var mongoose = require('mongoose');
var mongodb = require('../lib/mongodb');
var schema = require('../schema/category');
var model=  mongoose.model('category',new mongoose.Schema(schema,{ versionKey: false }));

class category extends mongodb {

	constructor() {
    	super(model);
	}
		
}

module.exports = category;