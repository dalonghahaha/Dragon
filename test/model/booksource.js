var config = require('../conf/application');
var mysql = require('../../index').Mysql;
var booksource = new mysql('booksource',config);
module.exports = booksource;