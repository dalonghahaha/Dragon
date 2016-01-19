var config = require('../conf/application');
var mongodb = require('../../index').Mongo;
var category = new mongodb('categories',config);
module.exports = category;