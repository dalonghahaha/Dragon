var config = require('../conf/application');
var mysql = require('../../index').Mysql;
var post = new mysql('post',config);
module.exports = post;