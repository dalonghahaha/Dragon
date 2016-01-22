var config = require('../conf/application');
var mysql = require('../../index').Mysql;
var country = new mysql('country',config);
module.exports = country;