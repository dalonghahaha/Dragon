var mongoose = require('mongoose');
var util = require('util');
var mongodb = require('../lib/mongodb');
var schema = require('../schema/category');
var model=  mongoose.model('category',new mongoose.Schema(schema,{ versionKey: false }));
module.exports = orm;
function orm(){
	this.model = model;
}
util.inherits(orm, mongodb);