var config = require('../conf/application');
var mysql = require('../../index').Mysql;
var area = new mysql('area',config);
module.exports = area;