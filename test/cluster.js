var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var server = require('../index').Server;
var config = require('./conf/application');

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
         cluster.fork();
    }
    cluster.on('listening', function (worker, address) {
        //console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });
} else if (cluster.isWorker) {
    var service = new server(config);
    service.run();
}