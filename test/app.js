var server = require('../index').Server;
var config = require('./conf/application');
var service = new server(config);
service.run();